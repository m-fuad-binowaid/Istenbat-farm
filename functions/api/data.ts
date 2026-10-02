/**
 * Cloudflare Pages Function: /api/data
 * Handles GET and POST requests to read/write data in Cloudflare KV (ESTINBAT_KV).
 */

interface Env {
  ESTINBAT_KV: KVNamespace;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

/**
 * GET /api/data?key=<KEY>
 * Returns the JSON value stored at KV[key], or null if not found.
 */
export async function onRequestGet(context: PagesContext): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing key parameter' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  try {
    const raw = await env.ESTINBAT_KV.get(key);
    const data = raw !== null ? JSON.parse(raw) : null;
    return new Response(JSON.stringify({ data }), { status: 200, headers: JSON_HEADERS });
  } catch (err) {
    console.error('[KV GET] Failed to read key:', key, err);
    return new Response(JSON.stringify({ data: null, error: 'Read failed' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
}

/**
 * POST /api/data
 * Body: { key: string, data: unknown }
 * Writes JSON.stringify(data) to KV[key].
 */
export async function onRequestPost(context: PagesContext): Promise<Response> {
  const { request, env } = context;

  let body: { key?: string; data?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const { key, data } = body;
  if (!key) {
    return new Response(JSON.stringify({ success: false, error: 'Missing key' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  try {
    await env.ESTINBAT_KV.put(key, JSON.stringify(data));
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: JSON_HEADERS });
  } catch (err) {
    console.error('[KV PUT] Failed to write key:', key, err);
    return new Response(JSON.stringify({ success: false, error: 'Write failed' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
}
