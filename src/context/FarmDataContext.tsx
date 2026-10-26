import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Product, ContactSettings, CategoryItem, ActivityCard, StoreLocation } from '../types';
import {
  OFFICIAL_INFO,
  PRODUCTS_CATALOG,
  INITIAL_CATEGORIES,
  INITIAL_ACTIVITIES,
  INITIAL_LOCATIONS,
} from '../data/content';

// ─── Cloud Sync Types ────────────────────────────────────────────────────────
/**
 * Cloud persistence model (Cloudflare KV via /api/data):
 *  - On load, the provider performs a READ-ONLY GET. It never writes during hydration.
 *  - Visitors never write: a POST is only sent when an admin PIN session is active.
 *  - Every admin mutation triggers a debounced POST of the COMPLETE dataset.
 */
export type CloudStatus =
  | 'loading'    // initial GET in progress
  | 'synced'     // in-memory state matches the cloud record
  | 'local-only' // cloud empty (404) — showing local seed/cache until the admin saves
  | 'dirty'      // unsaved admin changes pending upload
  | 'saving'     // POST in progress
  | 'error';     // last cloud read/write failed — see cloudError

export interface FarmDataSnapshot {
  contactInfo: ContactSettings;
  products: Product[];
  categories: CategoryItem[];
  activities: ActivityCard[];
  locations: StoreLocation[];
}

export interface FarmDataExport {
  app: 'istenbat-farm';
  version: 1;
  exportedAt: string;
  revision: number;
  data: FarmDataSnapshot;
}

export interface CloudSaveResult {
  ok: boolean;
  status?: number;
  conflict?: boolean;
  error?: string;
}

type HydrationState = 'pending' | 'remote' | 'empty' | 'failed';

type RemoteResult =
  | { kind: 'remote'; revision: number; data: Partial<FarmDataSnapshot> }
  | { kind: 'empty' }
  | { kind: 'failed' };

const SESSION_KEY_ADMIN_PIN = 'estinbat_admin_session_pin';
const AUTO_SAVE_DEBOUNCE_MS = 600;

// ─── KV API Helpers ───────────────────────────────────────────────────────────
/** READ-ONLY fetch of the master farm record from Cloudflare KV. Never writes. */
async function fetchRemoteData(): Promise<RemoteResult> {
  try {
    const res = await fetch('/api/data', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (res.status === 404) return { kind: 'empty' };
    if (!res.ok) return { kind: 'failed' };
    // Guard against SPA fallbacks (e.g. local Vite dev returning index.html with 200).
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return { kind: 'failed' };
    const body = (await res.json()) as {
      exists?: boolean;
      revision?: number;
      data?: Partial<FarmDataSnapshot>;
    };
    if (!body?.exists || !body.data || typeof body.data !== 'object') return { kind: 'empty' };
    return {
      kind: 'remote',
      revision: typeof body.revision === 'number' ? body.revision : 0,
      data: body.data,
    };
  } catch {
    return { kind: 'failed' };
  }
}

function isValidSnapshot(d: unknown): d is FarmDataSnapshot {
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

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  whatsapp: '+966501207704',
  whatsappRaw: '966501207704',
  phone: '0501207704',
  mobile: '0501207704',
  emailInfo: 'info@istenbat.com.sa',
  locationAr: 'طريق الملك عبدالله، الدلم 16312، المملكة العربية السعودية',
  locationEn: 'King Abdullah Rd, Ad Dilam 16312, Saudi Arabia',
  workingHoursAr: 'الأحد - الخميس: 9:00 ص - 6:00 م',
  workingHoursEn: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
  visitHoursAr: 'الجمعة - السبت: 9:00 ص - 6:00 م',
  visitHoursEn: 'Friday - Saturday: 9:00 AM - 6:00 PM',
};

// Initial products with isAvailable default true
const INITIAL_PRODUCTS: Product[] = PRODUCTS_CATALOG.map((p) => ({
  ...p,
  isAvailable: p.isAvailable !== undefined ? p.isAvailable : true,
}));

interface FarmDataContextType {
  contactInfo: ContactSettings;
  products: Product[];
  categories: CategoryItem[];
  activities: ActivityCard[];
  locations: StoreLocation[];
  updateContactInfo: (newInfo: Partial<ContactSettings>) => void;
  resetContactInfo: () => void;
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  resetProducts: () => void;
  addCategory: (category: Omit<CategoryItem, 'id'> & { id?: string }) => CategoryItem;
  updateCategory: (id: string, updated: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;
  updateActivity: (id: string, updated: Partial<ActivityCard>) => void;
  addActivity: (activity: Omit<ActivityCard, 'id'> & { id?: string }) => ActivityCard;
  deleteActivity: (id: string) => void;
  resetActivities: () => void;
  addLocation: (location: Omit<StoreLocation, 'id'> & { id?: string }) => StoreLocation;
  updateLocation: (id: string, updated: Partial<StoreLocation>) => void;
  deleteLocation: (id: string) => void;
  toggleLocationStatus: (id: string) => void;
  resetLocations: () => void;
  resetAllToDefaults: () => void;
  buildWhatsAppUrl: (message: string) => string;
  // ─── Cloud sync (Cloudflare KV) ───
  cloudStatus: CloudStatus;
  cloudError: string | null;
  /** Timestamp of the last successful admin POST to KV (null until first save in this session). */
  lastCloudSaveAt: number | null;
  /** Register / clear the admin PIN used to authorize cloud writes. Visitors never have one. */
  setAdminSessionPin: (pin: string | null) => void;
  /** Push the complete current dataset to Cloudflare KV. */
  saveToCloud: (opts?: { force?: boolean }) => Promise<CloudSaveResult>;
  exportData: () => FarmDataExport;
  /** Import a JSON backup (export file or raw dataset). Returns false if the shape is invalid. */
  importData: (payload: unknown) => boolean;
}

const FarmDataContext = createContext<FarmDataContextType | undefined>(undefined);

const STORAGE_KEY_CONTACT = 'istenbat_farm_contact_v1';
const STORAGE_KEY_PRODUCTS = 'istenbat_farm_products_v1';
const STORAGE_KEY_CATEGORIES = 'istenbat_farm_categories_v1';
const STORAGE_KEY_ACTIVITIES = 'istenbat_farm_activities_v1';
const STORAGE_KEY_LOCATIONS = 'istenbat_farm_locations_v1';

export const FarmDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load Contact Info from localStorage or fallback
  const [contactInfo, setContactInfo] = useState<ContactSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONTACT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.phone === '0114660423') {
          parsed.phone = '0501207704';
        }
        return { ...DEFAULT_CONTACT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error('Error loading contact info from localStorage', e);
    }
    return DEFAULT_CONTACT_SETTINGS;
  });

  // Load Categories from localStorage or fallback
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading categories from localStorage', e);
    }
    return INITIAL_CATEGORIES;
  });

  // Load Activities from localStorage or fallback
  const [activities, setActivities] = useState<ActivityCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading activities from localStorage', e);
    }
    return INITIAL_ACTIVITIES;
  });

  // Load Store Locations from localStorage or fallback
  const [locations, setLocations] = useState<StoreLocation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading store locations from localStorage', e);
    }
    return INITIAL_LOCATIONS;
  });

  // Load Products from localStorage or fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // ─── Cloud sync state ──────────────────────────────────────────────────────
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>('loading');
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [lastCloudSaveAt, setLastCloudSaveAt] = useState<number | null>(null);
  const [saveTick, setSaveTick] = useState(0);

  const hydrationRef = useRef<HydrationState>('pending');
  const revisionRef = useRef<number>(0);
  const savingRef = useRef(false);
  const pendingSaveRef = useRef(false);
  const adminPinRef = useRef<string | null>(
    (() => {
      try {
        return sessionStorage.getItem(SESSION_KEY_ADMIN_PIN);
      } catch {
        return null;
      }
    })()
  );

  // Always-current snapshot for the save routine (effects run after commit, so this is fresh).
  const dataRef = useRef<FarmDataSnapshot>({ contactInfo, products, categories, activities, locations });
  dataRef.current = { contactInfo, products, categories, activities, locations };

  // ─── On Mount: READ-ONLY hydration from Cloudflare KV ──────────────────────
  // ⚠️ This effect must NEVER write to KV. If the cloud is empty or unreachable we
  // simply keep rendering the local cache / seed data.
  useEffect(() => {
    let cancelled = false;
    async function hydrateFromKV() {
      const result = await fetchRemoteData();
      if (cancelled) return;

      if (result.kind === 'remote') {
        const d = result.data;
        if (Array.isArray(d.locations)) {
          setLocations(d.locations);
          try { localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(d.locations)); } catch {}
        }
        if (Array.isArray(d.products)) {
          setProducts(d.products);
          try { localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(d.products)); } catch {}
        }
        if (Array.isArray(d.categories)) {
          setCategories(d.categories);
          try { localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(d.categories)); } catch {}
        }
        if (Array.isArray(d.activities)) {
          setActivities(d.activities);
          try { localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(d.activities)); } catch {}
        }
        if (d.contactInfo && typeof d.contactInfo === 'object') {
          const merged = { ...DEFAULT_CONTACT_SETTINGS, ...d.contactInfo };
          setContactInfo(merged);
          try { localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(merged)); } catch {}
        }
        revisionRef.current = result.revision;
        hydrationRef.current = 'remote';
        setCloudStatus('synced');
        setCloudError(null);
      } else if (result.kind === 'empty') {
        revisionRef.current = 0;
        hydrationRef.current = 'empty';
        setCloudStatus('local-only');
      } else {
        hydrationRef.current = 'failed';
        setCloudStatus('error');
        setCloudError(
          'تعذر قراءة البيانات السحابية (Cloudflare KV). يتم عرض النسخة المحلية، ولن يتم الحفظ التلقائي لتجنب الكتابة فوق البيانات السحابية.'
        );
      }

      // Admin edits made while hydration was in flight: flush them now (only if safe).
      if (pendingSaveRef.current && hydrationRef.current !== 'failed') {
        pendingSaveRef.current = false;
        setSaveTick((t) => t + 1);
      }
    }
    hydrateFromKV();
    return () => { cancelled = true; };
  }, []);

  // ─── Mirror state to localStorage (offline cache only — never touches KV) ──
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(contactInfo));
    } catch (e) {
      console.error('Failed to save contact info to localStorage', e);
    }
  }, [contactInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to save activities to localStorage', e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(locations));
    } catch (e) {
      console.error('Failed to save store locations to localStorage', e);
    }
  }, [locations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  // ─── Cloud write (admin only) ──────────────────────────────────────────────
  const setAdminSessionPin = useCallback((pin: string | null) => {
    adminPinRef.current = pin;
    try {
      if (pin) sessionStorage.setItem(SESSION_KEY_ADMIN_PIN, pin);
      else sessionStorage.removeItem(SESSION_KEY_ADMIN_PIN);
    } catch {
      /* sessionStorage unavailable — PIN kept in memory only */
    }
  }, []);

  const saveToCloud = useCallback(async (opts: { force?: boolean } = {}): Promise<CloudSaveResult> => {
    const pin = adminPinRef.current;
    if (!pin) {
      const msg = 'لا توجد جلسة إدارة نشطة. سجّل الدخول برمز PIN لتفعيل المزامنة السحابية.';
      setCloudStatus('error');
      setCloudError(msg);
      return { ok: false, error: msg };
    }
    if (hydrationRef.current === 'pending') {
      pendingSaveRef.current = true;
      return { ok: false, error: 'pending-hydration' };
    }
    if (hydrationRef.current === 'failed' && !opts.force) {
      const msg =
        'لم يتم التحقق من النسخة السحابية الحالية، لذلك أُوقف الحفظ التلقائي لحماية البيانات. استخدم "فرض الحفظ" إذا كنت متأكداً أن هذه النسخة هي الأحدث.';
      setCloudStatus('error');
      setCloudError(msg);
      return { ok: false, error: msg };
    }
    if (savingRef.current) {
      pendingSaveRef.current = true;
      return { ok: false, error: 'busy' };
    }

    savingRef.current = true;
    setCloudStatus('saving');
    setCloudError(null);
    const snapshot = dataRef.current;
    let succeeded = false;

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pin}`,
        },
        body: JSON.stringify({
          data: snapshot,
          baseRevision: revisionRef.current,
          force: !!opts.force,
        }),
      });

      let body: { success?: boolean; timestamp?: number; revision?: number } | null = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }

      if (res.ok && body?.success) {
        succeeded = true;
        revisionRef.current = typeof body.revision === 'number' ? body.revision : revisionRef.current + 1;
        hydrationRef.current = 'remote';
        setLastCloudSaveAt(body.timestamp ?? Date.now());
        setCloudStatus(pendingSaveRef.current ? 'dirty' : 'synced');
        return { ok: true, status: res.status };
      }

      let msg: string;
      if (res.status === 401) {
        msg = 'رمز المرور غير مصرّح له بالكتابة السحابية (401). تأكد من رمز PIN أو من متغير ADMIN_PINS في إعدادات Cloudflare. التغييرات محفوظة على هذا الجهاز فقط.';
      } else if (res.status === 409) {
        msg = 'تم تعديل البيانات السحابية من جهاز آخر بعد فتح هذه الصفحة (409). صدّر نسخة احتياطية ثم أعد تحميل الصفحة لجلب أحدث نسخة، أو استخدم "فرض الحفظ".';
      } else {
        msg = `فشلت المزامنة السحابية (HTTP ${res.status}). التغييرات محفوظة على هذا الجهاز فقط.`;
      }
      pendingSaveRef.current = false;
      setCloudStatus('error');
      setCloudError(msg);
      return { ok: false, status: res.status, conflict: res.status === 409, error: msg };
    } catch (err) {
      console.warn('[KV] Cloud save failed:', err);
      const msg = 'تعذر الاتصال بالخادم السحابي. التغييرات محفوظة على هذا الجهاز فقط — أعد المحاولة عند توفر الاتصال.';
      pendingSaveRef.current = false;
      setCloudStatus('error');
      setCloudError(msg);
      return { ok: false, error: msg };
    } finally {
      savingRef.current = false;
      // Changes made while the request was in flight → push them in a follow-up save.
      if (succeeded && pendingSaveRef.current) {
        pendingSaveRef.current = false;
        setSaveTick((t) => t + 1);
      }
    }
  }, []);

  // Debounced auto-save, triggered ONLY by admin mutations (never by hydration).
  useEffect(() => {
    if (saveTick === 0) return;
    const timer = setTimeout(() => {
      void saveToCloud();
    }, AUTO_SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [saveTick, saveToCloud]);

  /** Called by every mutation. Visitors (no admin PIN) never trigger a cloud write. */
  const markDirty = () => {
    if (!adminPinRef.current) return;
    setCloudStatus('dirty');
    setSaveTick((t) => t + 1);
  };

  const updateContactInfo = (newInfo: Partial<ContactSettings>) => {
    setContactInfo((prev) => {
      // Normalize raw whatsapp digits
      let raw = newInfo.whatsappRaw || prev.whatsappRaw;
      if (newInfo.whatsapp && !newInfo.whatsappRaw) {
        raw = newInfo.whatsapp.replace(/\D/g, '');
      }
      return {
        ...prev,
        ...newInfo,
        whatsappRaw: raw,
      };
    });
    markDirty();
  };

  const resetContactInfo = () => {
    setContactInfo(DEFAULT_CONTACT_SETTINGS);
    markDirty();
  };

  const addCategory = (categoryData: Omit<CategoryItem, 'id'> & { id?: string }): CategoryItem => {
    const rawId = categoryData.id || `cat-${Date.now()}`;
    const cleanId = rawId.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const newCategory: CategoryItem = {
      ...categoryData,
      id: cleanId,
      nameAr: categoryData.nameAr.trim(),
      nameEn: categoryData.nameEn?.trim() || categoryData.nameAr.trim(),
    };
    setCategories((prev) => [...prev, newCategory]);
    markDirty();
    return newCategory;
  };

  const updateCategory = (id: string, updated: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    // If name changed, synchronize with product labels
    if (updated.nameAr || updated.nameEn) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.category === id) {
            return {
              ...p,
              categoryLabelAr: updated.nameAr || p.categoryLabelAr,
              categoryLabelEn: updated.nameEn || p.categoryLabelEn,
            };
          }
          return p;
        })
      );
    }
    markDirty();
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    markDirty();
  };

  const resetCategories = () => {
    setCategories(INITIAL_CATEGORIES);
    markDirty();
  };

  const addProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    const id = productData.id || `custom-prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      isAvailable: productData.isAvailable !== undefined ? productData.isAvailable : true,
      benefitsAr: productData.benefitsAr || ['منتج عضوي 100% طازج من حقول المزرعة'],
      benefitsEn: productData.benefitsEn || ['100% Fresh Organic Farm Harvest'],
      isCertifiedOrganic: productData.isCertifiedOrganic !== undefined ? productData.isCertifiedOrganic : true,
    };
    setProducts((prev) => [newProduct, ...prev]);
    markDirty();
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    markDirty();
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    markDirty();
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item
      )
    );
    markDirty();
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    markDirty();
  };

  const updateActivity = (id: string, updated: Partial<ActivityCard>) => {
    setActivities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    markDirty();
  };

  const addActivity = (activityData: Omit<ActivityCard, 'id'> & { id?: string }): ActivityCard => {
    const rawId = activityData.id || `act-${Date.now()}`;
    const cleanId = rawId.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const newActivity: ActivityCard = {
      ...activityData,
      id: cleanId,
    };
    setActivities((prev) => [...prev, newActivity]);
    markDirty();
    return newActivity;
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((item) => item.id !== id));
    markDirty();
  };

  const resetActivities = () => {
    setActivities(INITIAL_ACTIVITIES);
    markDirty();
  };

  const addLocation = (locationData: Omit<StoreLocation, 'id'> & { id?: string }): StoreLocation => {
    const rawId = locationData.id || `loc-${Date.now()}`;
    const cleanId = rawId.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const newLocation: StoreLocation = {
      ...locationData,
      id: cleanId,
      isActive: locationData.isActive !== undefined ? locationData.isActive : true,
    };
    setLocations((prev) => [...prev, newLocation]);
    markDirty();
    return newLocation;
  };

  const updateLocation = (id: string, updated: Partial<StoreLocation>) => {
    setLocations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    markDirty();
  };

  const deleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((item) => item.id !== id));
    markDirty();
  };

  const toggleLocationStatus = (id: string) => {
    setLocations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
    markDirty();
  };

  const resetLocations = () => {
    setLocations(INITIAL_LOCATIONS);
    markDirty();
  };

  const resetAllToDefaults = () => {
    setContactInfo(DEFAULT_CONTACT_SETTINGS);
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setActivities(INITIAL_ACTIVITIES);
    setLocations(INITIAL_LOCATIONS);
    try {
      localStorage.removeItem(STORAGE_KEY_CONTACT);
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
      localStorage.removeItem(STORAGE_KEY_CATEGORIES);
      localStorage.removeItem(STORAGE_KEY_ACTIVITIES);
      localStorage.removeItem(STORAGE_KEY_LOCATIONS);
    } catch (e) {
      console.error(e);
    }
    // Explicit admin action → goes through the authenticated cloud save path only.
    markDirty();
  };

  // ─── Backup tools ──────────────────────────────────────────────────────────
  const exportData = (): FarmDataExport => ({
    app: 'istenbat-farm',
    version: 1,
    exportedAt: new Date().toISOString(),
    revision: revisionRef.current,
    data: dataRef.current,
  });

  const importData = (payload: unknown): boolean => {
    const candidate =
      payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)
        ? (payload as Record<string, unknown>).data
        : payload;
    if (!isValidSnapshot(candidate)) return false;
    setContactInfo({ ...DEFAULT_CONTACT_SETTINGS, ...candidate.contactInfo });
    setProducts(candidate.products);
    setCategories(candidate.categories);
    setActivities(candidate.activities);
    setLocations(candidate.locations);
    markDirty();
    return true;
  };

  const buildWhatsAppUrl = (message: string) => {
    const rawNumber = contactInfo.whatsappRaw || '966501207704';
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <FarmDataContext.Provider
      value={{
        contactInfo,
        products,
        categories,
        activities,
        locations,
        updateContactInfo,
        resetContactInfo,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        resetProducts,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategories,
        updateActivity,
        addActivity,
        deleteActivity,
        resetActivities,
        addLocation,
        updateLocation,
        deleteLocation,
        toggleLocationStatus,
        resetLocations,
        resetAllToDefaults,
        buildWhatsAppUrl,
        cloudStatus,
        cloudError,
        lastCloudSaveAt,
        setAdminSessionPin,
        saveToCloud,
        exportData,
        importData,
      }}
    >
      {children}
    </FarmDataContext.Provider>
  );
};

export const useFarmData = () => {
  const context = useContext(FarmDataContext);
  if (!context) {
    throw new Error('useFarmData must be used within a FarmDataProvider');
  }
  return context;
};
