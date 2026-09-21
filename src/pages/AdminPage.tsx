import React, { useState } from 'react';
import { PageRoute, Product } from '../types';
import { useFarmData } from '../context/FarmDataContext';
import {
  Lock,
  Unlock,
  KeyRound,
  Package,
  Phone,
  Plus,
  Edit2,
  Trash2,
  Check,
  CheckCircle2,
  X,
  RotateCcw,
  Save,
  LogOut,
  ExternalLink,
  Search,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';

const PRESET_FARM_ASSETS = [
  { path: '/assets/fruitsvegies10.jpg', name: 'خضار وفواكه المزرعة' },
  { path: '/assets/fruitsvegies05.jpg', name: 'سلال الطماطم والخضار' },
  { path: '/assets/fruitsvegies02.jpg', name: 'محاصيل البيوت المحمية' },
  { path: '/assets/prod01a.png', name: 'عسل سدر طبيعي خام' },
  { path: '/assets/prod02a.png', name: 'بيض بلدي حر' },
  { path: '/assets/prod03a.png', name: 'فطر المحار الطازج' },
  { path: '/assets/prod04a.png', name: 'شعير مستنبت أخضر' },
  { path: '/assets/prod11a.png', name: 'أعشاب ونعناع عضوي' },
  { path: '/assets/prod17a.png', name: 'خضار ورقية منتقاة' },
  { path: '/assets/prod18a.png', name: 'منتجات غذائية ريفية' },
  { path: '/assets/dairy-halloumi.jpg', name: 'جبن حلوم بلدي' },
  { path: '/assets/dairy-akkawi.jpg', name: 'جبن عكاوي طازج' },
  { path: '/assets/hero-sunflowers.jpg', name: 'حقول دوار الشمس' },
  { path: '/assets/hero-crops.jpg', name: 'حقول زراعية خضراء' },
];

const CATEGORIES_LIST = [
  { id: 'veggies', labelAr: 'خضار وورقيات', labelEn: 'Fresh Vegetables & Greens' },
  { id: 'dairy', labelAr: 'ألبان وأجبان ريفية', labelEn: 'Farm Dairy & Cheeses' },
  { id: 'honey-poultry', labelAr: 'عسل ودواجن وبيض', labelEn: 'Honey, Poultry & Eggs' },
  { id: 'mushrooms-herbs', labelAr: 'فطريات وأعشاب واستنبات', labelEn: 'Sprouts, Mushrooms & Herbs' },
];

interface AdminPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const {
    contactInfo,
    products,
    updateContactInfo,
    resetContactInfo,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    resetAllToDefaults,
  } = useFarmData();

  // PIN Authentication State (Stored in sessionStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('istenbat_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'products' | 'contact'>('products');

  // Search & Filter in Products
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add/Edit Product Modal State
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    nameAr: '',
    nameEn: '',
    category: 'veggies' as 'veggies' | 'dairy' | 'mushrooms-herbs' | 'honey-poultry',
    weightAr: '1 كجم',
    weightEn: '1 kg',
    descriptionAr: '',
    descriptionEn: '',
    image: '/assets/fruitsvegies10.jpg',
    isAvailable: true,
  });

  // Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState(contactInfo);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // PIN Gate Submit Handler
  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('istenbat_admin_auth', 'true');
      setPinError('');
      showToast('مرحباً بك! تم تسجيل الدخول إلى لوحة التحكم بنجاح');
    } else {
      setPinError('رمز المرور غير صحيح. الرمز الافتراضي هو 1234');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('istenbat_admin_auth');
    setPinInput('');
  };

  // Product Modal Openers
  const openAddModal = () => {
    setEditingProductId(null);
    setProductForm({
      nameAr: '',
      nameEn: '',
      category: 'veggies',
      weightAr: '1 كجم',
      weightEn: '1 kg',
      descriptionAr: '',
      descriptionEn: '',
      image: '/assets/fruitsvegies10.jpg',
      isAvailable: true,
    });
    setModalMode('add');
  };

  const openEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    const cat = (['veggies', 'dairy', 'mushrooms-herbs', 'honey-poultry'].includes(prod.category)
      ? prod.category
      : 'veggies') as 'veggies' | 'dairy' | 'mushrooms-herbs' | 'honey-poultry';

    setProductForm({
      nameAr: prod.nameAr,
      nameEn: prod.nameEn || prod.nameAr,
      category: cat,
      weightAr: prod.weightAr || '1 كجم',
      weightEn: prod.weightEn || '1 kg',
      descriptionAr: prod.descriptionAr || '',
      descriptionEn: prod.descriptionEn || '',
      image: prod.image,
      isAvailable: prod.isAvailable !== false,
    });
    setModalMode('edit');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.nameAr.trim()) {
      alert('يرجى كتابة اسم المنتج بالعربية');
      return;
    }

    const catObj = CATEGORIES_LIST.find((c) => c.id === productForm.category) || CATEGORIES_LIST[0];

    if (modalMode === 'add') {
      addProduct({
        nameAr: productForm.nameAr.trim(),
        nameEn: productForm.nameEn.trim() || productForm.nameAr.trim(),
        category: productForm.category,
        categoryLabelAr: catObj.labelAr,
        categoryLabelEn: catObj.labelEn,
        weightAr: productForm.weightAr.trim() || '1 كجم',
        weightEn: productForm.weightEn.trim() || '1 kg',
        descriptionAr: productForm.descriptionAr.trim(),
        descriptionEn: productForm.descriptionEn.trim(),
        benefitsAr: ['منتج عضوي 100% طازج من حقول المزرعة', 'إنتاج مستدام وخالٍ من الكيماويات'],
        benefitsEn: ['100% Fresh Organic Farm Harvest', 'Sustainable & Chemical-Free'],
        image: productForm.image,
        isCertifiedOrganic: true,
        isAvailable: productForm.isAvailable,
      });
      showToast('تمت إضافة المنتج بنجاح وتحديث المتجر مباشرة! ✨');
    } else if (modalMode === 'edit' && editingProductId) {
      updateProduct(editingProductId, {
        nameAr: productForm.nameAr.trim(),
        nameEn: productForm.nameEn.trim() || productForm.nameAr.trim(),
        category: productForm.category,
        categoryLabelAr: catObj.labelAr,
        categoryLabelEn: catObj.labelEn,
        weightAr: productForm.weightAr.trim(),
        weightEn: productForm.weightEn.trim(),
        descriptionAr: productForm.descriptionAr.trim(),
        descriptionEn: productForm.descriptionEn.trim(),
        image: productForm.image,
        isAvailable: productForm.isAvailable,
      });
      showToast('تم حفظ تعديلات المنتج ونشرها في المتجر مباشرة! ✨');
    }
    setModalMode(null);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      showToast(`تم حذف "${productToDelete.nameAr}" من قائمة المنتجات بنجاح.`);
      setProductToDelete(null);
    }
  };

  // Contact Form Save
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo(contactForm);
    showToast('تم حفظ ونشر بيانات التواصل والمواعيد فوراً في الموقع! ✨');
  };

  const handleResetContact = () => {
    if (window.confirm('هل تريد استعادة بيانات التواصل والمواعيد الأصلية للمزرعة؟')) {
      resetContactInfo();
      setContactForm(contactInfo);
      showToast('تمت استعادة إعدادات التواصل الأصلية للمزرعة.');
    }
  };

  // Filtered products list for admin
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      productSearch.trim() === '' ||
      p.nameAr.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // -------------------------------------------------------------
  // VIEW A: PIN Authentication Screen (if not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#122216] text-[#F9F6F0] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-tajawal select-none"
      >
        {/* Subtle background glow */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#1C3322]/90 border border-[#2D4C35] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative z-10 text-center">
          {/* Logo & Icon */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase block mb-1">
            لوحة الإدارة والمحتوى
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            مزرعة بيت الاستنبات
          </h1>
          <p className="text-xs sm:text-sm text-[#A1B8A7] mb-6 leading-relaxed">
            يرجى إدخال رمز المرور (PIN) للوصول إلى أدوات التحكم في المنتجات والمواعيد وبيانات التواصل.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="أدخل رمز الدخول (الافتراضي: 1234)"
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl bg-[#122216] border border-[#2D4C35] text-center text-xl font-bold tracking-widest text-emerald-300 placeholder:text-gray-500 placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-center gap-2 text-start">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#122216] font-bold text-sm sm:text-base rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-5 h-5" />
              <span>دخول لوحة التحكم</span>
            </button>
          </form>

          {/* Quick Numpad for Mobile Convenience */}
          <div className="mt-6 pt-6 border-t border-[#2D4C35]">
            <span className="text-[11px] text-[#A1B8A7] block mb-3">لوحة مفاتيح سريعة للجوال:</span>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setPinInput((prev) => (prev.length < 8 ? prev + num : prev));
                    setPinError('');
                  }}
                  className="py-3 rounded-xl bg-[#16291b] hover:bg-[#1f3a26] text-white font-bold text-lg active:scale-95 transition-all border border-[#2D4C35]/50"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPinInput('')}
                className="py-3 rounded-xl bg-[#241c1c] text-red-300 font-bold text-xs hover:bg-[#332222] transition-all"
              >
                مسح
              </button>
              <button
                type="button"
                onClick={() => {
                  setPinInput((prev) => (prev.length < 8 ? prev + '0' : prev));
                  setPinError('');
                }}
                className="py-3 rounded-xl bg-[#16291b] hover:bg-[#1f3a26] text-white font-bold text-lg active:scale-95 transition-all border border-[#2D4C35]/50"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setPinInput((prev) => prev.slice(0, -1))}
                className="py-3 rounded-xl bg-[#1f2e22] text-emerald-300 font-bold text-sm hover:bg-[#283d2c] transition-all"
              >
                ←
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <span>← العودة إلى الموقع الرئيسي للمزرعة</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: Full Authenticated Admin Dashboard
  // -------------------------------------------------------------
  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#F9F6F0] text-[#2B2821] font-tajawal pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1C3322] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header Banner */}
      <header className="bg-[#1C3322] text-[#F9F6F0] py-6 px-4 sm:px-8 border-b border-[#2D4C35] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-start w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">لوحة إدارة بيت الاستنبات</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  مباشر
                </span>
              </div>
              <p className="text-xs text-[#A1B8A7]">
                التحكم بالمنتجات، حالة التوفر، أرقام التواصل وساعات العمل مع التحديث الفوري
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>معاينة الموقع الرئيسي</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Navigation Tabs (Mobile-Friendly Pill Tabs) */}
        <div className="flex items-center gap-3 p-1.5 bg-[#F4EFE6] rounded-2xl border border-[#E7DECD] max-w-md mx-auto mb-8 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#1C3322] text-white shadow-md'
                : 'text-[#50452d] hover:text-[#1C3322]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>المنتجات والمحاصيل ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-[#1C3322] text-white shadow-md'
                : 'text-[#50452d] hover:text-[#1C3322]'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>بيانات التواصل والمواعيد</span>
          </button>
        </div>

        {/* ============================================================= */}
        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {/* ============================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header Controls: Add Button & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#E7DECD] shadow-xs">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="بحث في المنتجات..."
                    className="w-full pr-10 pl-4 py-2 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm font-medium focus:outline-none"
                >
                  <option value="all">كل الأقسام</option>
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.labelAr}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="px-5 py-3 rounded-2xl bg-[#1C3322] hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة منتج جديد للمزرعة</span>
              </button>
            </div>

            {/* Products Visual Cards Grid (Card-Based, No Dense Grids) */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E7DECD] space-y-3">
                <Package className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-base font-bold text-[#1C3322]">لا توجد منتجات مطابقة للبحث</h3>
                <p className="text-xs text-gray-500">
                  جرّب تغيير كلمات البحث أو أضف منتجاً جديداً للظهور في هذه القائمة.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => {
                  const isAvailable = product.isAvailable !== false;
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl p-5 border border-[#E7DECD] shadow-xs flex flex-col justify-between hover:shadow-md transition-all gap-4 text-start"
                    >
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl overflow-hidden bg-[#F4EFE6] border border-[#E7DECD] shrink-0 relative">
                          <img
                            src={product.image}
                            alt={product.nameAr}
                            className={`w-full h-full object-cover transition-opacity ${
                              isAvailable ? 'opacity-100' : 'opacity-40 grayscale'
                            }`}
                          />
                          {!isAvailable && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] font-bold">
                              غير متوفر
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {product.categoryLabelAr || product.category}
                            </span>
                            {product.weightAr && (
                              <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {product.weightAr}
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-[#1C3322] truncate">
                            {product.nameAr}
                          </h3>
                          <p className="text-[11px] text-gray-500 font-sans truncate mb-2">
                            {product.nameEn}
                          </p>
                          <p className="text-xs text-[#50452d] line-clamp-2 leading-relaxed">
                            {product.descriptionAr}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer: Availability Switch & Actions */}
                      <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between gap-2">
                        {/* Single-Tap Availability Switch */}
                        <button
                          type="button"
                          onClick={() => {
                            toggleProductAvailability(product.id);
                            showToast(
                              isAvailable
                                ? `تم إيقاف توفر "${product.nameAr}" في المتجر`
                                : `تم تفعيل توفر "${product.nameAr}" في المتجر بنجاح`
                            );
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                          }`}
                          title="انقر لتبديل حالة التوفر"
                        >
                          {isAvailable ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>متوفر في المزرعة</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                              <span>نفد المخزون</span>
                            </>
                          )}
                        </button>

                        {/* Edit & Delete Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="px-3 py-1.5 rounded-xl bg-[#F4EFE6] hover:bg-[#E7DECD] text-[#1C3322] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                            title="حذف المنتج"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: CONTACT & SCHEDULE SETTINGS */}
        {/* ============================================================= */}
        {activeTab === 'contact' && (
          <div className="max-w-3xl mx-auto space-y-6 text-start">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DECD] shadow-xs">
              <div className="pb-4 mb-6 border-b border-[#E7DECD]">
                <h2 className="text-xl font-black text-[#1C3322] mb-1">
                  إعدادات التواصل وساعات المزرعة بالدلم
                </h2>
                <p className="text-xs text-[#50452d]">
                  أي تعديل تدخله هنا ينعكس فوراً ومباشرةً على الشريط العلوي، الفوتر، روابط واتساب، وصفحة التواصل للموقع بالكامل.
                </p>
              </div>

              <form onSubmit={handleSaveContact} className="space-y-5">
                {/* 1. WhatsApp Number */}
                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1.5">
                    رقم الواتساب المعتمد للطلبات والزيارات (WhatsApp) *
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={contactForm.whatsapp}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        whatsapp: e.target.value,
                        whatsappRaw: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    placeholder="+966501207704"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F9F6F0] border border-[#E7DECD] text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600 font-mono"
                  />
                  <span className="text-[11px] text-gray-500 block mt-1">
                    ترتبط به أزرار حجز الزيارات والاستفسار التلقائي في الموقع.
                  </span>
                </div>

                {/* 2. Landline Phone & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1C3322] mb-1.5">
                      الهاتف الثابت المكتبي *
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="0114660423"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F9F6F0] border border-[#E7DECD] text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C3322] mb-1.5">
                      رقم الجوال الإضافي
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={contactForm.mobile}
                      onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value })}
                      placeholder="0501207704"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F9F6F0] border border-[#E7DECD] text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600 font-mono"
                    />
                  </div>
                </div>

                {/* 3. Official Email */}
                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1.5">
                    البريد الإلكتروني المعتمد *
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={contactForm.emailInfo}
                    onChange={(e) => setContactForm({ ...contactForm, emailInfo: e.target.value })}
                    placeholder="info@istenbat.com.sa"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F9F6F0] border border-[#E7DECD] text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>

                {/* 4. Physical Location (Arabic & English) */}
                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1.5">
                    موقع وعنوان المزرعة بالدلم (بالعربية) *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.locationAr}
                    onChange={(e) => setContactForm({ ...contactForm, locationAr: e.target.value })}
                    placeholder="طريق الملك عبدالله، الدلم 16312، المملكة العربية السعودية"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F9F6F0] border border-[#E7DECD] text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1.5">
                    موقع وعنوان المزرعة (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={contactForm.locationEn}
                    onChange={(e) => setContactForm({ ...contactForm, locationEn: e.target.value })}
                    placeholder="King Abdullah Rd, Ad Dilam 16312, Saudi Arabia"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F9F6F0] border border-[#E7DECD] text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600 font-sans"
                  />
                </div>

                {/* 5. Working & Visit Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1C3322] mb-1.5">
                      ساعات العمل الرسمية الإدارية *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.workingHoursAr}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, workingHoursAr: e.target.value })
                      }
                      placeholder="الأحد - الخميس: 9:00 ص - 6:00 م"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F9F6F0] border border-[#E7DECD] text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C3322] mb-1.5">
                      ساعات استقبال الزيارات والمخيم *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.visitHoursAr}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, visitHoursAr: e.target.value })
                      }
                      placeholder="الجمعة - السبت: 9:00 ص - 6:00 م"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F9F6F0] border border-[#E7DECD] text-sm text-[#2B2821] focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="pt-6 border-t border-[#E7DECD] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#1C3322] hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-emerald-400" />
                    <span>حفظ ونشر التعديلات فوراً 💾</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetContact}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#F4EFE6] hover:bg-[#E7DECD] text-[#50452d] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>استعادة بيانات المزرعة الأصلية</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT MODAL WITH VISUAL ASSET PICKER */}
      {/* ============================================================= */}
      {modalMode && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E7DECD] shadow-2xl relative max-h-[90vh] overflow-y-auto text-start">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7DECD] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#1C3322]">
                  {modalMode === 'add' ? 'إضافة منتج جديد للمزرعة' : 'تعديل بيانات المنتج'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1">
                    اسم المنتج بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.nameAr}
                    onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
                    placeholder="مثال: طماطم كرزية عضوية"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1">
                    English Name
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={productForm.nameEn}
                    onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                    placeholder="e.g. Organic Cherry Tomatoes"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1">
                    تصنيف المنتج *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.labelAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1">
                    وحدة الوزن / الحجم
                  </label>
                  <input
                    type="text"
                    value={productForm.weightAr}
                    onChange={(e) => setProductForm({ ...productForm, weightAr: e.target.value })}
                    placeholder="مثال: 500 جم أو 1 كجم أو عبوة"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C3322] mb-1">
                  وصف مختصر للمنتج
                </label>
                <textarea
                  rows={2}
                  value={productForm.descriptionAr}
                  onChange={(e) => setProductForm({ ...productForm, descriptionAr: e.target.value })}
                  placeholder="وصف لطبيعة المنتج وطزاجته وفوائده الصحية..."
                  className="w-full px-4 py-2 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Visual Asset Picker */}
              <div>
                <label className="block text-xs font-bold text-[#1C3322] mb-2 flex items-center justify-between">
                  <span>اختر صورة المنتج من مكتبة صور المزرعة:</span>
                  <span className="text-[11px] text-emerald-800 font-normal">
                    انقر على أي صورة للاختيار الفوري
                  </span>
                </label>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 p-3 rounded-2xl bg-[#F4EFE6] border border-[#E7DECD] max-h-48 overflow-y-auto">
                  {PRESET_FARM_ASSETS.map((asset) => {
                    const isSelected = productForm.image === asset.path;
                    return (
                      <button
                        key={asset.path}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, image: asset.path })}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group focus:outline-none cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 ring-2 ring-emerald-500 scale-95 shadow-md'
                            : 'border-transparent hover:border-emerald-400'
                        }`}
                        title={asset.name}
                      >
                        <img
                          src={asset.path}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-emerald-700/50 flex items-center justify-center text-white">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Option to type custom image url if wanted */}
                <div className="mt-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    dir="ltr"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="/assets/prod01a.png"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#F9F6F0] border border-[#E7DECD] text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">حالة توفر المنتج</span>
                  <span className="text-[11px] text-emerald-700">
                    عند تفعيله، سيظهر المنتج فوراً للزوار في قائمة المتجر والصفحة الرئيسية.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={productForm.isAvailable}
                  onChange={(e) =>
                    setProductForm({ ...productForm, isAvailable: e.target.checked })
                  }
                  className="w-5 h-5 accent-[#1C3322] cursor-pointer"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-[#E7DECD] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1C3322] hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{modalMode === 'add' ? 'إضافة المنتج فوراً' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 2: SOFT DELETE CONFIRMATION DIALOG */}
      {/* ============================================================= */}
      {productToDelete && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E7DECD] shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-[#1C3322]">
              هل أنت متأكد من رغبتك في حذف هذا المنتج؟
            </h3>
            <p className="text-xs text-[#50452d] leading-relaxed">
              سيتم حذف <strong className="text-red-700">"{productToDelete.nameAr}"</strong> من قائمة منتجات المزرعة وإخفاؤه مباشرة من المتجر.
            </p>

            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>تأكيد الحذف</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
