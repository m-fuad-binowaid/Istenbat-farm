import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ContactSettings, CategoryItem, ActivityCard } from '../types';
import { OFFICIAL_INFO, PRODUCTS_CATALOG, INITIAL_CATEGORIES, INITIAL_ACTIVITIES } from '../data/content';

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
  resetAllToDefaults: () => void;
  buildWhatsAppUrl: (message: string) => string;
}

const FarmDataContext = createContext<FarmDataContextType | undefined>(undefined);

const STORAGE_KEY_CONTACT = 'istenbat_farm_contact_v1';
const STORAGE_KEY_PRODUCTS = 'istenbat_farm_products_v1';
const STORAGE_KEY_CATEGORIES = 'istenbat_farm_categories_v1';
const STORAGE_KEY_ACTIVITIES = 'istenbat_farm_activities_v1';

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

  // Automatically save contactInfo to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(contactInfo));
    } catch (e) {
      console.error('Failed to save contact info to localStorage', e);
    }
  }, [contactInfo]);

  // Automatically save categories to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  // Automatically save activities to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to save activities to localStorage', e);
    }
  }, [activities]);

  // Automatically save products to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

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
  };

  const resetContactInfo = () => {
    setContactInfo(DEFAULT_CONTACT_SETTINGS);
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
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const resetCategories = () => {
    setCategories(INITIAL_CATEGORIES);
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
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item
      )
    );
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  const updateActivity = (id: string, updated: Partial<ActivityCard>) => {
    setActivities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const addActivity = (activityData: Omit<ActivityCard, 'id'> & { id?: string }): ActivityCard => {
    const rawId = activityData.id || `act-${Date.now()}`;
    const cleanId = rawId.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const newActivity: ActivityCard = {
      ...activityData,
      id: cleanId,
    };
    setActivities((prev) => [...prev, newActivity]);
    return newActivity;
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((item) => item.id !== id));
  };

  const resetActivities = () => {
    setActivities(INITIAL_ACTIVITIES);
  };

  const resetAllToDefaults = () => {
    setContactInfo(DEFAULT_CONTACT_SETTINGS);
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setActivities(INITIAL_ACTIVITIES);
    try {
      localStorage.removeItem(STORAGE_KEY_CONTACT);
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
      localStorage.removeItem(STORAGE_KEY_CATEGORIES);
      localStorage.removeItem(STORAGE_KEY_ACTIVITIES);
    } catch (e) {
      console.error(e);
    }
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
        resetAllToDefaults,
        buildWhatsAppUrl,
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
