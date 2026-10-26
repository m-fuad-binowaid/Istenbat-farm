/**
 * Cloudflare Pages Function: /api/data
 *
 * Persistent store for Istenbat Farm admin data, backed by Cloudflare KV (ESTINBAT_KV).
 *
 * Guarantees:
 *  - GET is strictly READ-ONLY. It never seeds, writes or overwrites anything in KV.
 *  - POST is the ONLY write path and requires a valid admin PIN in the Authorization header.
 *  - Frontend builds / git pushes / SEO deploys only replace static assets in `dist/`;
 *    nothing in the build pipeline touches ESTINBAT_KV.
 *
 * Optional environment variable (Cloudflare Pages → Settings → Variables & Secrets):
 *  - ADMIN_PINS: comma-separated list of PINs allowed to write (e.g. "882244,113355").
 *    If not set, the default owner/assistant PINs are accepted.
 */

interface Env {
  ESTINBAT_KV: KVNamespace;
  ADMIN_PINS?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}

/** Single master record holding the complete farm dataset. */
const MASTER_KEY = 'estinbat_master_v1';

/** Legacy per-section keys (read-only fallback for migration; never written or deleted). */
const LEGACY_KEYS = {
  locations: 'estinbat_locations',
  products: 'estinbat_products',
  categories: 'estinbat_categories',
  activities: 'estinbat_gallery',
  contactInfo: 'estinbat_contact',
} as const;

const DEFAULT_ADMIN_PINS = ['882244', '113355'];

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

interface FarmDataset {
  contactInfo: Record<string, unknown>;
  products: unknown[];
  categories: unknown[];
  activities: unknown[];
  locations: unknown[];
}

interface MasterRecord {
  revision: number;
  updatedAt: number;
  data: FarmDataset;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

/** Constant-time string comparison to avoid timing leaks on PIN checks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function isAuthorized(request: Request, env: Env): boolean {
  const header = request.headers.get('Authorization') || '';
  const pin = header.replace(/^Bearer\s+/i, '').trim();
  if (!pin) return false;
  const allowed = (env.ADMIN_PINS || '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const pins = allowed.length > 0 ? allowed : DEFAULT_ADMIN_PINS;
  return pins.some((p) => safeEqual(p, pin));
}

function isValidDataset(d: unknown): d is FarmDataset {
  if (!d || typeof d !== 'object') return false;
  const x = d as Record<string, unknown>;
  return (
    !!x.contactInfo &&
    typeof x.contactInfo === 'object' &&
    !Array.isArray(x.contactInfo) &&
    Array.isArray(x.products) &&
    Array.isArray(x.categories) &&
    Array.isArray(x.activities) &&
    Array.isArray(x.locations)
  );
}

async function readMaster(env: Env): Promise<MasterRecord | null> {
  const raw = await env.ESTINBAT_KV.get(MASTER_KEY);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if ('data' in parsed && isValidDataset(parsed.data)) {
      return {
        revision: typeof parsed.revision === 'number' ? parsed.revision : 0,
        updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
        data: parsed.data,
      };
    }
    if (isValidDataset(parsed)) {
      return {
        revision: 0,
        updatedAt: Date.now(),
        data: parsed,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * GET /api/data
 * STRICTLY READ-ONLY.
 *  - 200 { exists: true, revision, updatedAt, data } when the master record exists.
 *  - 200 { exists: true, legacy: true, revision: 0, data } when only legacy keys exist.
 *  - 404 { exists: false } when KV holds no farm data at all.
 */
export async function onRequestGet(context: PagesContext): Promise<Response> {
  const { env } = context;
  try {
    const master = await readMaster(env);
    if (master) {
      return json({
        exists: true,
        revision: master.revision ?? 0,
        updatedAt: master.updatedAt ?? null,
        data: master.data,
      });
    }

    // Legacy fallback (read-only): assemble from the old per-section keys if any exist.
    const entries = await Promise.all(
      Object.entries(LEGACY_KEYS).map(async ([field, key]) => {
        const raw = await env.ESTINBAT_KV.get(key);
        return [field, raw !== null ? JSON.parse(raw) : null] as const;
      })
    );
    const legacy: Record<string, unknown> = {};
    let found = false;
    for (const [field, value] of entries) {
      if (value !== null && value !== undefined) {
        legacy[field] = value;
        found = true;
      }
    }
    if (found) {
      return json({ exists: true, legacy: true, revision: 0, updatedAt: null, data: legacy });
    }

    return json({ exists: false }, 404);
  } catch (err) {
    console.error('[KV GET] Failed to read farm data:', err);
    return json({ exists: false, error: 'Read failed' }, 500);
  }
}

/**
 * POST /api/data
 * Headers: Authorization: Bearer <ADMIN_PIN>
 * Body: { data: FarmDataset, baseRevision?: number, force?: boolean } OR direct FarmDataset
 *
 * Writes the COMPLETE dataset to the master key. If `baseRevision` does not match the
 * stored revision (another device saved in between) the write is rejected with 409
 * unless `force: true` is sent, so a stale tab can never silently revert newer data.
 */
export async function onRequestPost(context: PagesContext): Promise<Response> {
  const { request, env } = context;

  if (!isAuthorized(request, env)) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  let rawBody: Record<string, unknown> | null = null;
  try {
    rawBody = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const dataset: FarmDataset | null =
    rawBody && typeof rawBody === 'object' && 'data' in rawBody && isValidDataset(rawBody.data)
      ? (rawBody.data as FarmDataset)
      : isValidDataset(rawBody)
      ? (rawBody as FarmDataset)
      : null;

  if (!dataset) {
    return json({ success: false, error: 'Invalid dataset shape' }, 400);
  }

  const baseRevision = typeof rawBody?.baseRevision === 'number' ? rawBody.baseRevision : undefined;
  const force = Boolean(rawBody?.force);

  try {
    const existing = await readMaster(env);
    const currentRevision = existing?.revision ?? 0;

    if (
      existing &&
      !force &&
      typeof baseRevision === 'number' &&
      baseRevision !== currentRevision
    ) {
      return json(
        {
          success: false,
          error: 'Conflict',
          revision: currentRevision,
          updatedAt: existing.updatedAt ?? null,
        },
        409
      );
    }

    const timestamp = Date.now();
    const record: MasterRecord = {
      revision: currentRevision + 1,
      updatedAt: timestamp,
      data: dataset,
    };
    await env.ESTINBAT_KV.put(MASTER_KEY, JSON.stringify(record));

    return json({ success: true, timestamp, revision: record.revision });
  } catch (err) {
    console.error('[KV PUT] Failed to write farm data:', err);
    return json({ success: false, error: 'Write failed' }, 500);
  }
}
