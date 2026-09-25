import React, { useState, useRef } from 'react';
import { PageRoute, Product, CategoryItem, ActivityCard } from '../types';
import { useFarmData } from '../context/FarmDataContext';
import { getAssetUrl } from '../utils/assetPath';
import { processImageUpload, processMediaUpload } from '../utils/imageUpload';
import {
  Lock,
  KeyRound,
  Package,
  Phone,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  RotateCcw,
  Save,
  LogOut,
  Search,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  Camera,
  Tags,
  ImagePlus,
  CheckCircle2,
  Sparkles,
  Film,
  Video,
  Play,
  Compass,
  AlertTriangle,
  Link as LinkIcon,
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

const PRESET_ACTIVITY_MEDIA = [
  { path: '/assets/fruitsvegies10.jpg', name: 'قطف الخضار والفواكه', type: 'image' as const },
  { path: '/assets/visitor03.jpg', name: 'زيارة المزرعة والمناحل', type: 'image' as const },
  { path: '/assets/visitor06.jpg', name: 'أنشطة العائلات والمجموعات', type: 'image' as const },
  { path: '/assets/visitor11.jpg', name: 'المخيم والجلسات الريفية', type: 'image' as const },
  { path: '/assets/visitor10.jpg', name: 'مزارع الاستنبات والبيوت المحمية', type: 'image' as const },
  { path: '/assets/visitor08.jpg', name: 'الأشجار والواحات الريفية', type: 'image' as const },
];

interface AdminPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const {
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
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategories,
    updateActivity,
    addActivity,
    deleteActivity,
    resetActivities,
    resetAllToDefaults,
  } = useFarmData();

  // PIN Authentication State (Stored in sessionStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('istenbat_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'activities' | 'contact'>('products');

  // Search & Filter in Products
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add/Edit Product Modal State
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    nameAr: '',
    nameEn: '',
    category: categories[0]?.id || 'veggies',
    weightAr: '1 كجم',
    weightEn: '1 kg',
    priceAr: '',
    descriptionAr: '',
    descriptionEn: '',
    image: '/assets/fruitsvegies10.jpg',
    isAvailable: true,
  });

  // Local image upload state & ref (Product)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'preset'>('upload');
  const [isDragging, setIsDragging] = useState(false);

  // Inline Category creation inside Product Modal
  const [showInlineCategoryCreator, setShowInlineCategoryCreator] = useState(false);
  const [inlineCatNameAr, setInlineCatNameAr] = useState('');
  const [inlineCatNameEn, setInlineCatNameEn] = useState('');

  // Dedicated Category Management Modal State
  const [categoryModalMode, setCategoryModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    nameAr: '',
    nameEn: '',
  });

  // Dedicated Activity Cards Management State
  const [activityModalMode, setActivityModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState({
    titleAr: '',
    titleEn: '',
    tagAr: '',
    tagEn: '',
    descriptionAr: '',
    descriptionEn: '',
    detailsArText: '',
    detailsEnText: '',
    mediaType: 'image' as 'image' | 'video',
    mediaUrl: '/assets/fruitsvegies10.jpg',
  });
  const activityMediaInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessingActivityMedia, setIsProcessingActivityMedia] = useState(false);
  const [activityMediaWarning, setActivityMediaWarning] = useState<string | null>(null);
  const [activityMediaSourceTab, setActivityMediaSourceTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isDraggingActivityMedia, setIsDraggingActivityMedia] = useState(false);

  // Delete Confirmation States
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<ActivityCard | null>(null);

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

  // -------------------------------------------------------------
  // Product Modal Handlers
  // -------------------------------------------------------------
  const openAddModal = () => {
    setEditingProductId(null);
    setProductForm({
      nameAr: '',
      nameEn: '',
      category: categories[0]?.id || 'veggies',
      weightAr: '1 كجم',
      weightEn: '1 kg',
      priceAr: '',
      descriptionAr: '',
      descriptionEn: '',
      image: '/assets/fruitsvegies10.jpg',
      isAvailable: true,
    });
    setShowInlineCategoryCreator(false);
    setImageTab('upload');
    setModalMode('add');
  };

  const openEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    const validCat = categories.some((c) => c.id === prod.category)
      ? prod.category
      : categories[0]?.id || 'veggies';

    setProductForm({
      nameAr: prod.nameAr,
      nameEn: prod.nameEn || prod.nameAr,
      category: validCat,
      weightAr: prod.weightAr || '1 كجم',
      weightEn: prod.weightEn || '1 kg',
      priceAr: prod.priceAr || '',
      descriptionAr: prod.descriptionAr || '',
      descriptionEn: prod.descriptionEn || '',
      image: prod.image,
      isAvailable: prod.isAvailable !== false,
    });
    setShowInlineCategoryCreator(false);
    setImageTab('upload');
    setModalMode('edit');
  };

  const handleFilePicked = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    try {
      setIsProcessingImage(true);
      const dataUrl = await processImageUpload(file);
      setProductForm((prev) => ({ ...prev, image: dataUrl }));
      showToast('تم تحميل صورة المنتج ومعالجتها بنجاح 📸');
    } catch (err) {
      console.error('Image processing failed', err);
      alert('حدث خطأ أثناء قراءة الصورة. يرجى تجربة صورة أخرى.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFilePicked(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFilePicked(file);
    }
  };

  const handleSaveInlineCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inlineCatNameAr.trim()) {
      alert('يرجى كتابة اسم الصنف بالعربية');
      return;
    }

    const created = addCategory({
      nameAr: inlineCatNameAr.trim(),
      nameEn: inlineCatNameEn.trim() || inlineCatNameAr.trim(),
    });

    setProductForm((prev) => ({ ...prev, category: created.id }));
    setInlineCatNameAr('');
    setInlineCatNameEn('');
    setShowInlineCategoryCreator(false);
    showToast(`تم إنشاء صنف "${created.nameAr}" واختياره للمنتج بنجاح! ✅`);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.nameAr.trim()) {
      alert('يرجى كتابة اسم المنتج بالعربية');
      return;
    }

    const catObj = categories.find((c) => c.id === productForm.category) || {
      id: productForm.category,
      nameAr: 'صنف عام',
      nameEn: 'General',
    };

    if (modalMode === 'add') {
      addProduct({
        nameAr: productForm.nameAr.trim(),
        nameEn: productForm.nameEn.trim() || productForm.nameAr.trim(),
        category: productForm.category,
        categoryLabelAr: catObj.nameAr,
        categoryLabelEn: catObj.nameEn,
        weightAr: productForm.weightAr.trim() || '1 كجم',
        weightEn: productForm.weightEn.trim() || '1 kg',
        priceAr: productForm.priceAr.trim() || undefined,
        descriptionAr: productForm.descriptionAr.trim(),
        descriptionEn: productForm.descriptionEn.trim(),
        benefitsAr: ['منتج عضوي 100% طازج من حقول المزرعة', 'إنتاج مستدام وخالٍ من الكيماويات'],
        benefitsEn: ['100% Fresh Organic Farm Harvest', 'Sustainable & Chemical-Free'],
        image: productForm.image,
        isCertifiedOrganic: true,
        isAvailable: productForm.isAvailable,
      });
      showToast('تم حفظ التعديلات وتحديث الموقع فوراً ✅');
    } else if (modalMode === 'edit' && editingProductId) {
      updateProduct(editingProductId, {
        nameAr: productForm.nameAr.trim(),
        nameEn: productForm.nameEn.trim() || productForm.nameAr.trim(),
        category: productForm.category,
        categoryLabelAr: catObj.nameAr,
        categoryLabelEn: catObj.nameEn,
        weightAr: productForm.weightAr.trim(),
        weightEn: productForm.weightEn.trim(),
        priceAr: productForm.priceAr.trim() || undefined,
        descriptionAr: productForm.descriptionAr.trim(),
        descriptionEn: productForm.descriptionEn.trim(),
        image: productForm.image,
        isAvailable: productForm.isAvailable,
      });
      showToast('تم حفظ التعديلات وتحديث الموقع فوراً ✅');
    }
    setModalMode(null);
  };

  const handleConfirmDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      showToast(`تم حذف "${productToDelete.nameAr}" من قائمة المنتجات بنجاح.`);
      setProductToDelete(null);
    }
  };

  // -------------------------------------------------------------
  // Dedicated Category Management Handlers
  // -------------------------------------------------------------
  const openAddCategoryModal = () => {
    setEditingCategoryId(null);
    setCategoryForm({
      nameAr: '',
      nameEn: '',
    });
    setCategoryModalMode('add');
  };

  const openEditCategoryModal = (cat: CategoryItem) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      nameAr: cat.nameAr,
      nameEn: cat.nameEn || cat.nameAr,
    });
    setCategoryModalMode('edit');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.nameAr.trim()) {
      alert('يرجى إدخال اسم الصنف بالعربية');
      return;
    }

    if (categoryModalMode === 'add') {
      addCategory({
        nameAr: categoryForm.nameAr.trim(),
        nameEn: categoryForm.nameEn.trim() || categoryForm.nameAr.trim(),
      });
      showToast('تم حفظ التعديلات وتحديث الموقع فوراً ✅');
    } else if (categoryModalMode === 'edit' && editingCategoryId) {
      updateCategory(editingCategoryId, {
        nameAr: categoryForm.nameAr.trim(),
        nameEn: categoryForm.nameEn.trim() || categoryForm.nameAr.trim(),
      });
      showToast('تم حفظ التعديلات وتحديث الموقع فوراً ✅');
    }
    setCategoryModalMode(null);
  };

  const handleConfirmDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      showToast(`تم حذف صنف "${categoryToDelete.nameAr}" بنجاح.`);
      setCategoryToDelete(null);
    }
  };

  // -------------------------------------------------------------
  // Dedicated Activities & Experiences Handlers
  // -------------------------------------------------------------
  const openAddActivityModal = () => {
    setEditingActivityId(null);
    setActivityForm({
      titleAr: '',
      titleEn: '',
      tagAr: 'أنشطة ريفية مميزة',
      tagEn: 'Special Countryside Activity',
      descriptionAr: '',
      descriptionEn: '',
      detailsArText: 'نشاط ممتع وتجربة حية في قلب المزرعة\nمناسب للعائلات والأطفال والزيارات\nإشراف كامل وضيافة نجدية أصيلة',
      detailsEnText: 'Exciting outdoor farm activity\nSuitable for families, kids and groups\nFull guidance and Saudi hospitality',
      mediaType: 'image',
      mediaUrl: '/assets/fruitsvegies10.jpg',
    });
    setActivityMediaWarning(null);
    setActivityMediaSourceTab('upload');
    setActivityModalMode('add');
  };

  const openEditActivityModal = (act: ActivityCard) => {
    setEditingActivityId(act.id);
    setActivityForm({
      titleAr: act.titleAr,
      titleEn: act.titleEn || act.titleAr,
      tagAr: act.tagAr || '',
      tagEn: act.tagEn || act.tagAr || '',
      descriptionAr: act.descriptionAr || '',
      descriptionEn: act.descriptionEn || '',
      detailsArText: (act.detailsAr || []).join('\n'),
      detailsEnText: (act.detailsEn || []).join('\n'),
      mediaType: act.mediaType || (act.mediaUrl.endsWith('.mp4') ? 'video' : 'image'),
      mediaUrl: act.mediaUrl,
    });
    setActivityMediaWarning(null);
    setActivityMediaSourceTab('upload');
    setActivityModalMode('edit');
  };

  const handleActivityMediaPicked = async (file: File) => {
    try {
      setIsProcessingActivityMedia(true);
      setActivityMediaWarning(null);
      const res = await processMediaUpload(file);
      setActivityForm((prev) => ({
        ...prev,
        mediaUrl: res.dataUrl,
        mediaType: res.mediaType,
      }));
      if (res.warning) {
        setActivityMediaWarning(res.warning);
      }
      showToast(
        res.mediaType === 'video'
          ? 'تم رفع مقطع الفيديو بنجاح 🎬'
          : 'تم رفع صورة النشاط بنجاح 📸'
      );
    } catch (err) {
      console.error('Activity media processing failed', err);
      alert('حدث خطأ أثناء معالجة الوسائط. يرجى تجربة ملف آخر.');
    } finally {
      setIsProcessingActivityMedia(false);
    }
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.titleAr.trim()) {
      alert('يرجى كتابة عنوان النشاط بالعربية');
      return;
    }
    if (!activityForm.tagAr.trim()) {
      alert('يرجى كتابة الشارة المميزة (الوسم) للنشاط');
      return;
    }

    const detailsAr = activityForm.detailsArText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const detailsEn = activityForm.detailsEnText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (activityModalMode === 'add') {
      addActivity({
        titleAr: activityForm.titleAr.trim(),
        titleEn: activityForm.titleEn.trim() || activityForm.titleAr.trim(),
        tagAr: activityForm.tagAr.trim(),
        tagEn: activityForm.tagEn.trim() || activityForm.tagAr.trim(),
        descriptionAr: activityForm.descriptionAr.trim(),
        descriptionEn: activityForm.descriptionEn.trim(),
        detailsAr: detailsAr.length > 0 ? detailsAr : ['تجربة ريفية فريدة في مزارع بيت الاستنبات بالدلم'],
        detailsEn: detailsEn.length > 0 ? detailsEn : ['Unique rural experience at Istenbat Farms'],
        mediaType: activityForm.mediaType,
        mediaUrl: activityForm.mediaUrl || '/assets/fruitsvegies10.jpg',
      });
      showToast('تم حفظ التعديلات وتحديث الموقع فوراً ✅');
    } else if (activityModalMode === 'edit' && editingActivityId) {
      updateActivity(editingActivityId, {
        titleAr: activityForm.titleAr.trim(),
        titleEn: activityForm.titleEn.trim() || activityForm.titleAr.trim(),
        tagAr: activityForm.tagAr.trim(),
        tagEn: activityForm.tagEn.trim() || activityForm.tagAr.trim(),
        descriptionAr: activityForm.descriptionAr.trim(),
        descriptionEn: activityForm.descriptionEn.trim(),
        detailsAr,
        detailsEn,
        mediaType: activityForm.mediaType,
        mediaUrl: activityForm.mediaUrl || '/assets/fruitsvegies10.jpg',
      });
      showToast('تم حفظ التعديلات وتحديث الموقع فوراً ✅');
    }

    setActivityModalMode(null);
  };

  const handleConfirmDeleteActivity = () => {
    if (activityToDelete) {
      deleteActivity(activityToDelete.id);
      showToast(`تم حذف بطاقة "${activityToDelete.titleAr}" بنجاح.`);
      setActivityToDelete(null);
    }
  };

  // -------------------------------------------------------------
  // Contact Form Save
  // -------------------------------------------------------------
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo(contactForm);
    showToast('تم حفظ التعديلات وتحديث الموقع فوراً ✅');
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
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#1C3322]/90 border border-[#2D4C35] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative z-10 text-center">
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
            يرجى إدخال رمز المرور (PIN) للوصول إلى أدوات التحكم في المنتجات، وسائط الأنشطة، والأصناف.
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
                    if (pinInput.length < 8) setPinInput((prev) => prev + num);
                    setPinError('');
                  }}
                  className="py-2.5 rounded-xl bg-[#122216] hover:bg-emerald-950/50 border border-[#2D4C35] text-lg font-bold text-white transition-colors cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPinInput('')}
                className="py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-xs font-bold text-red-300 transition-colors cursor-pointer"
              >
                مسح
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pinInput.length < 8) setPinInput((prev) => prev + '0');
                  setPinError('');
                }}
                className="py-2.5 rounded-xl bg-[#122216] hover:bg-emerald-950/50 border border-[#2D4C35] text-lg font-bold text-white transition-colors cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setPinInput((prev) => prev.slice(0, -1))}
                className="py-2.5 rounded-xl bg-[#122216] hover:bg-emerald-950/50 border border-[#2D4C35] text-xs font-bold text-[#A1B8A7] transition-colors cursor-pointer"
              >
                ←
              </button>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs text-[#A1B8A7] hover:text-white underline cursor-pointer"
            >
              العودة إلى الموقع الرئيسي
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: Full Admin Dashboard
  // -------------------------------------------------------------
  return (
    <div dir="rtl" className="min-h-screen bg-[#F9F6F0] text-[#2B2821] font-tajawal pb-24">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl bg-[#1C3322] text-white text-xs sm:text-sm font-bold shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="bg-[#1C3322] text-white border-b border-[#2D4C35] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold">
              إدارة
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black leading-tight">
                لوحة تحكم بيت الاستنبات
              </h1>
              <p className="text-[11px] text-[#A1B8A7]">
                التحكم المباشر في المنتجات، وسائط الأنشطة والتجارب، والأصناف، والتواصل
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onNavigate('experience')}
              className="px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer text-white"
            >
              <span>معاينة الأنشطة</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer text-white"
            >
              <span>معاينة المتجر</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Navigation Tabs (Mobile-Friendly Pill Tabs) */}
        <div className="flex items-center gap-2 p-1.5 bg-[#F4EFE6] rounded-2xl border border-[#E7DECD] max-w-2xl mx-auto mb-8 shadow-inner overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex-1 min-w-[110px] py-3 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#1C3322] text-white shadow-md'
                : 'text-[#50452d] hover:text-[#1C3322]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>المنتجات ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`flex-1 min-w-[130px] py-3 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-[#1C3322] text-white shadow-md'
                : 'text-[#50452d] hover:text-[#1C3322]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>بطاقات الأنشطة ({activities.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex-1 min-w-[110px] py-3 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#1C3322] text-white shadow-md'
                : 'text-[#50452d] hover:text-[#1C3322]'
            }`}
          >
            <Tags className="w-4 h-4" />
            <span>الأصناف ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex-1 min-w-[110px] py-3 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-[#1C3322] text-white shadow-md'
                : 'text-[#50452d] hover:text-[#1C3322]'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>التواصل</span>
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
                  <option value="all">كل الأصناف ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameAr} ({products.filter((p) => p.category === c.id).length})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openAddModal}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#1C3322] hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>
            </div>

            {/* Products Visual Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E7DECD] space-y-3">
                <Package className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-base font-bold text-[#1C3322]">لا توجد منتجات مطابقة للبحث</h3>
                <p className="text-xs text-gray-500">
                  جرّب تغيير كلمات البحث أو أضف منتجاً جديداً للظهور في هذه القائمة.
                </p>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج جديد الآن</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => {
                  const isAvailable = product.isAvailable !== false;
                  const matchedCat = categories.find((c) => c.id === product.category);
                  const catLabel = matchedCat?.nameAr || product.categoryLabelAr || product.category;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl p-5 border border-[#E7DECD] shadow-xs flex flex-col justify-between hover:shadow-md transition-all gap-4 text-start"
                    >
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl overflow-hidden bg-[#F4EFE6] border border-[#E7DECD] shrink-0 relative">
                          <img
                            src={getAssetUrl(product.image)}
                            alt={product.nameAr}
                            className={`w-full h-full object-cover transition-opacity ${
                              isAvailable ? 'opacity-100' : 'opacity-40 grayscale'
                            }`}
                          />
                          {!isAvailable && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-[10px] font-bold">
                              نفد المخزون
                            </span>
                          )}
                          {product.image.startsWith('data:') && (
                            <span className="absolute bottom-1 end-1 bg-emerald-900/80 text-white text-[9px] px-1.5 py-0.5 rounded-sm">
                              صورة محلية
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {catLabel}
                            </span>
                            {product.weightAr && (
                              <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {product.weightAr}
                              </span>
                            )}
                            {product.priceAr && (
                              <span className="text-[10px] font-bold text-[#1C3322] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                {product.priceAr}
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
        {/* TAB 2: ACTIVITIES & ABOUT US MEDIA MANAGEMENT                */}
        {/* ============================================================= */}
        {activeTab === 'activities' && (
          <div className="space-y-6 text-start">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E7DECD] shadow-xs">
              <div>
                <h2 className="text-lg font-black text-[#1C3322] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-700" />
                  <span>إدارة بطاقات الأنشطة والتجارب (من نحن والسياحة)</span>
                </h2>
                <p className="text-xs text-[#50452d] mt-1">
                  تعديل الصور ومقاطع الفيديو التفاعلية لبطاقات أنشطة المزرعة، مع دعم رفع مقاطع الفيديو المحلية أو الروابط المباشرة.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openAddActivityModal}
                  className="px-5 py-3 rounded-2xl bg-[#1C3322] hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <span>إضافة بطاقة نشاط (+ New Activity)</span>
                </button>
              </div>
            </div>

            {/* Grid of activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map((act) => {
                const isVideo =
                  act.mediaType === 'video' ||
                  act.mediaUrl.endsWith('.mp4') ||
                  act.mediaUrl.endsWith('.webm') ||
                  act.mediaUrl.startsWith('data:video');

                return (
                  <div
                    key={act.id}
                    className="bg-white rounded-3xl border border-[#E7DECD] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Media Thumbnail with Badges */}
                      <div className="relative w-full h-52 bg-[#122216] overflow-hidden">
                        {isVideo ? (
                          <div className="w-full h-full relative group">
                            <video
                              src={getAssetUrl(act.mediaUrl)}
                              muted
                              playsInline
                              autoPlay
                              loop
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                              <Play className="w-8 h-8 text-white/80 fill-white/80" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={getAssetUrl(act.mediaUrl)}
                            alt={act.titleAr}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Floating Green Tag Badge */}
                        <div className="absolute top-3 end-3 px-3 py-1 rounded-full bg-[#1C3322]/95 backdrop-blur-md text-[#F9F6F0] text-xs font-bold shadow-md border border-white/10 z-10">
                          {act.tagAr}
                        </div>

                        {/* Media Type Badge */}
                        <div className="absolute bottom-3 start-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 z-10">
                          {isVideo ? (
                            <>
                              <Film className="w-3.5 h-3.5 text-amber-400" />
                              <span>فيديو (Video)</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                              <span>صورة (Image)</span>
                            </>
                          )}
                        </div>

                        {act.mediaUrl.startsWith('data:') && (
                          <div className="absolute bottom-3 end-3 px-2 py-0.5 rounded bg-emerald-900/80 text-white text-[10px] z-10">
                            ملف محلي مرفوع
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <h3 className="text-lg font-black text-[#1C3322]">
                          {act.titleAr}
                        </h3>
                        <p className="text-xs text-gray-500 font-sans">
                          {act.titleEn}
                        </p>
                        <p className="text-xs text-[#50452d] line-clamp-2 leading-relaxed">
                          {act.descriptionAr}
                        </p>

                        {/* Points badge */}
                        <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{act.detailsAr.length} نقاط ومميزات مسجلة للنشاط</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 pt-0 border-t border-[#F0EAE1] flex items-center justify-between gap-2 mt-4 pt-3">
                      <button
                        type="button"
                        onClick={() => openEditActivityModal(act)}
                        className="px-4 py-2 rounded-xl bg-[#1C3322] hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>تعديل البطاقة والوسائط</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivityToDelete(act)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="حذف البطاقة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('هل تريد استعادة بطاقات الأنشطة والتجارب الافتراضية الأصلية للمزرعة؟')) {
                    resetActivities();
                    showToast('تمت استعادة بطاقات الأنشطة الأصلية بنجاح.');
                  }
                }}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>استعادة البطاقات الافتراضية</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 3: DYNAMIC CATEGORY MANAGEMENT */}
        {/* ============================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6 text-start">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E7DECD] shadow-xs">
              <div>
                <h2 className="text-lg font-black text-[#1C3322] flex items-center gap-2">
                  <Tags className="w-5 h-5 text-emerald-700" />
                  <span>إدارة الأصناف والتصنيفات (Categories)</span>
                </h2>
                <p className="text-xs text-[#50452d] mt-1">
                  أضف أصناف جديدة أو عدّل مسمياتها، وستظهر فوراً في تبويبات الفرز بالمتجر وقائمة المنتجات.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openAddCategoryModal}
                  className="px-5 py-3 rounded-2xl bg-[#1C3322] hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <span>إضافة صنف جديد (+ New Category)</span>
                </button>
              </div>
            </div>

            {/* Categories Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const count = products.filter((p) => p.category === category.id).length;

                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-3xl p-5 border border-[#E7DECD] shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          #{category.id}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          {count} منتج
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-[#1C3322] mb-1">
                        {category.nameAr}
                      </h3>
                      <p className="text-xs text-gray-500 font-sans">
                        {category.nameEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openEditCategoryModal(category)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#F4EFE6] hover:bg-[#E7DECD] text-[#1C3322] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>تعديل الصنف</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCategoryToDelete(category)}
                        className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="حذف الصنف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('هل تريد استعادة الأصناف الافتراضية الأصلية للمزرعة؟')) {
                    resetCategories();
                    showToast('تمت استعادة الأصناف الأصلية بنجاح.');
                  }
                }}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>استعادة الأصناف الافتراضية</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 4: CONTACT & SCHEDULE SETTINGS */}
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

                {/* 2. Official Phone & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1C3322] mb-1.5">
                      رقم الهاتف المعتمد للاتصال *
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="0501207704"
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
      {/* MODAL 1: ADD / EDIT PRODUCT MODAL WITH DIRECT FILE UPLOADER   */}
      {/* ============================================================= */}
      {modalMode && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 border border-[#E7DECD] shadow-2xl relative max-h-[92vh] overflow-y-auto text-start">
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
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1C3322]">
                    الصنف / الكاتيجوري (Category) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInlineCategoryCreator((prev) => !prev)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ إضافة صنف جديد</span>
                  </button>
                </div>

                {showInlineCategoryCreator && (
                  <div className="p-3 mb-2 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 animate-fadeIn">
                    <span className="text-xs font-bold text-emerald-900 block">
                      إضافة صنف جديد سريعاً:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="اسم الصنف بالعربية (مثل: فواكه موسمية)"
                        value={inlineCatNameAr}
                        onChange={(e) => setInlineCatNameAr(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs focus:outline-none focus:border-emerald-600"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="English Name (e.g. Seasonal Fruits)"
                        value={inlineCatNameEn}
                        onChange={(e) => setInlineCatNameEn(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs focus:outline-none focus:border-emerald-600 font-sans"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowInlineCategoryCreator(false)}
                        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveInlineCategory}
                        className="px-3.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>حفظ وتحديد الصنف</span>
                      </button>
                    </div>
                  </div>
                )}

                <select
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameAr} ({c.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1">
                    الوزن الصافي / الوحدة
                  </label>
                  <input
                    type="text"
                    value={productForm.weightAr}
                    onChange={(e) => setProductForm({ ...productForm, weightAr: e.target.value })}
                    placeholder="مثال: 500 جم أو 1 كجم أو عبوة"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1">
                    السعر التقديري (اختياري)
                  </label>
                  <input
                    type="text"
                    value={productForm.priceAr}
                    onChange={(e) => setProductForm({ ...productForm, priceAr: e.target.value })}
                    placeholder="مثال: 25 ر.س"
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

              {/* UNIVERSAL IMAGE UPLOADER */}
              <div className="border border-[#E7DECD] rounded-2xl p-4 bg-[#FDFCFA] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E7DECD]">
                  <label className="text-xs font-bold text-[#1C3322] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-700" />
                    <span>صورة المنتج (Universal Image Uploader)</span>
                  </label>

                  <div className="flex items-center bg-[#F4EFE6] p-1 rounded-xl text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        imageTab === 'upload'
                          ? 'bg-[#1C3322] text-white shadow-xs'
                          : 'text-[#50452d] hover:text-[#1C3322]'
                      }`}
                    >
                      رفع من جهازك 📱💻
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('preset')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        imageTab === 'preset'
                          ? 'bg-[#1C3322] text-white shadow-xs'
                          : 'text-[#50452d] hover:text-[#1C3322]'
                      }`}
                    >
                      مكتبة صور المزرعة 🌿
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {imageTab === 'upload' ? (
                  <div className="space-y-3">
                    {productForm.image ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-[#F4EFE6] p-2 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-28 h-28 rounded-xl overflow-hidden bg-white border border-[#E7DECD] shrink-0 relative flex items-center justify-center">
                          <img
                            src={getAssetUrl(productForm.image)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-start">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {productForm.image.startsWith('data:') ? 'صورة محلية تم رفعها ✅' : 'صورة جاهزة'}
                            </span>
                          </div>
                          <p className="text-xs text-[#50452d] line-clamp-1">
                            جاهزة للنشر الفوري في المتجر والصفحة الرئيسية.
                          </p>

                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isProcessingImage}
                              className="px-3.5 py-1.5 rounded-xl bg-[#1C3322] hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Upload className="w-3.5 h-3.5 text-emerald-400" />
                              <span>استبدال الصورة</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setProductForm({ ...productForm, image: '' })}
                              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف الصورة</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-3 ${
                          isDragging
                            ? 'border-emerald-600 bg-emerald-50 scale-[1.01]'
                            : 'border-[#D5CABB] hover:border-emerald-600 bg-[#F9F6F0] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white text-emerald-800 flex items-center justify-center shadow-xs border border-[#E7DECD]">
                          <Camera className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C3322] mb-1">
                            اسحب الصورة هنا أو انقر للاختيار من جهازك
                          </p>
                          <p className="text-xs text-[#50452d]">
                            يدعم الاستوديو ومكتبة الصور، التقاط الكاميرا بالجوال، وملفات الكمبيوتر (JPG, PNG, WebP)
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C3322] text-white text-xs font-bold shadow-xs">
                          <Upload className="w-4 h-4 text-emerald-400" />
                          <span>اختر صورة من ألبوم الصور / الكاميرا</span>
                        </span>
                      </div>
                    )}

                    {isProcessingImage && (
                      <div className="text-center text-xs text-emerald-800 font-bold py-1">
                        جارٍ تحسين الصورة وتحويلها... ⏳
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[11px] text-[#50452d] block">
                      انقر على أي صورة لاختيارها للمنتج:
                    </span>
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
                              src={getAssetUrl(asset.path)}
                              alt={asset.name}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-emerald-700/60 flex items-center justify-center text-white">
                                <Check className="w-5 h-5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>{modalMode === 'add' ? 'إضافة المنتج فوراً' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 2: ADD / EDIT ACTIVITY CARD & MEDIA MODAL               */}
      {/* ============================================================= */}
      {activityModalMode && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 border border-[#E7DECD] shadow-2xl relative max-h-[92vh] overflow-y-auto text-start">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7DECD] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#1C3322]">
                    {activityModalMode === 'add'
                      ? 'إضافة بطاقة نشاط وتجربة جديدة'
                      : 'تعديل بطاقة النشاط والوسائط (صور وفيديو)'}
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    تظهر هذه البطاقات في قسم الأنشطة والسياحة الريفية ونُزل المزرعة
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivityModalMode(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4">
              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1">
                    عنوان النشاط بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    value={activityForm.titleAr}
                    onChange={(e) => setActivityForm({ ...activityForm, titleAr: e.target.value })}
                    placeholder="مثال: قطف الفواكه والخضروات العضوية"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1">
                    English Activity Title
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={activityForm.titleEn}
                    onChange={(e) => setActivityForm({ ...activityForm, titleEn: e.target.value })}
                    placeholder="e.g. Fresh Organic Fruit & Vegetable Picking"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-sans"
                  />
                </div>
              </div>

              {/* Floating Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1">
                    الشارة العائمة فوق الوسائط (بالعربية) *
                  </label>
                  <input
                    type="text"
                    required
                    value={activityForm.tagAr}
                    onChange={(e) => setActivityForm({ ...activityForm, tagAr: e.target.value })}
                    placeholder="مثال: استجمام وأجواء طبيعية هادئة أو قطف فوري قبل الدفع"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C3322] mb-1">
                    Floating Badge (English)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={activityForm.tagEn}
                    onChange={(e) => setActivityForm({ ...activityForm, tagEn: e.target.value })}
                    placeholder="e.g. Serene Nature & Starlit Nights"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-sans"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#1C3322] mb-1">
                  وصف تفصيلي للنشاط والتجربة
                </label>
                <textarea
                  rows={2}
                  value={activityForm.descriptionAr}
                  onChange={(e) => setActivityForm({ ...activityForm, descriptionAr: e.target.value })}
                  placeholder="استمتع بمتعة وتجربة قطف الفواكه والخضروات العضوية..."
                  className="w-full px-4 py-2 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Highlights Points */}
              <div>
                <label className="block text-xs font-bold text-[#1C3322] mb-1 flex items-center justify-between">
                  <span>نقاط ومميزات النشاط (تظهر مع علامات الصح الخضراء):</span>
                  <span className="text-[11px] text-gray-500 font-normal">اكتب كل نقطة في سطر مستقل</span>
                </label>
                <textarea
                  rows={3}
                  value={activityForm.detailsArText}
                  onChange={(e) => setActivityForm({ ...activityForm, detailsArText: e.target.value })}
                  placeholder={'قطف مباشر من البيوت المحمية والحقول المفتوحة\nسلة قطف شخصية وتذوق للمحاصيل الطازجة\nنشاط ممتع وتثقيفي للأطفال والعائلات'}
                  className="w-full px-4 py-2 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600 leading-relaxed font-mono"
                />
              </div>

              {/* ========================================================= */}
              {/* DUAL MEDIA UPLOADER (IMAGE OR VIDEO)                      */}
              {/* ========================================================= */}
              <div className="border border-[#E7DECD] rounded-2xl p-4 bg-[#FDFCFA] space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-[#E7DECD]">
                  <div>
                    <label className="text-xs font-bold text-[#1C3322] flex items-center gap-1.5">
                      <Film className="w-4 h-4 text-emerald-700" />
                      <span>وسائط البطاقة (Dual Media: صورة أو فيديو تفاعلي)</span>
                    </label>
                    <span className="text-[11px] text-gray-500">
                      اختر نوع الوسائط وارفع ملف من جهازك أو اختر من المكتبة
                    </span>
                  </div>

                  {/* Radio Toggle: Image vs Video */}
                  <div className="flex items-center gap-1 bg-[#F4EFE6] p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActivityForm({ ...activityForm, mediaType: 'image' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activityForm.mediaType === 'image'
                          ? 'bg-[#1C3322] text-white shadow-xs'
                          : 'text-[#50452d] hover:text-[#1C3322]'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>صورة (Image)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivityForm({ ...activityForm, mediaType: 'video' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activityForm.mediaType === 'video'
                          ? 'bg-[#1C3322] text-white shadow-xs'
                          : 'text-[#50452d] hover:text-[#1C3322]'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>فيديو (Video)</span>
                    </button>
                  </div>
                </div>

                {/* Source Subtabs */}
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <button
                    type="button"
                    onClick={() => setActivityMediaSourceTab('upload')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      activityMediaSourceTab === 'upload'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    رفع من جهازك 💻📱
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityMediaSourceTab('preset')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      activityMediaSourceTab === 'preset'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    مكتبة صور المزرعة 🌿
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityMediaSourceTab('url')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      activityMediaSourceTab === 'url'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    رابط مباشر 🔗
                  </button>
                </div>

                {/* Hidden File Input for Image or Video */}
                <input
                  ref={activityMediaInputRef}
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleActivityMediaPicked(file);
                  }}
                  className="hidden"
                />

                {/* Warning message if video is large */}
                {activityMediaWarning && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{activityMediaWarning}</p>
                  </div>
                )}

                {/* Live Preview Box */}
                {activityMediaSourceTab === 'upload' && (
                  <div className="space-y-3">
                    {activityForm.mediaUrl ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-[#F4EFE6] p-3 flex flex-col sm:flex-row items-center gap-4">
                        {/* Preview element */}
                        <div className="w-40 h-32 rounded-xl overflow-hidden bg-black shrink-0 relative flex items-center justify-center">
                          {activityForm.mediaType === 'video' ? (
                            <video
                              src={getAssetUrl(activityForm.mediaUrl)}
                              controls
                              autoPlay
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={getAssetUrl(activityForm.mediaUrl)}
                              alt="Activity Media Preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-start">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {activityForm.mediaType === 'video' ? 'فيديو جاهز للعرض 🎥' : 'صورة جاهزة 🖼️'}
                            </span>
                            {activityForm.mediaUrl.startsWith('data:') && (
                              <span className="text-[10px] text-gray-500">تم رفعه محلياً</span>
                            )}
                          </div>
                          <p className="text-xs text-[#50452d]">
                            يتم تشغيله تلقائياً وبشكل صامت مع زر تشغيل/إيقاف أنيق عند مرور المؤشر.
                          </p>

                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => activityMediaInputRef.current?.click()}
                              disabled={isProcessingActivityMedia}
                              className="px-3.5 py-1.5 rounded-xl bg-[#1C3322] hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Upload className="w-3.5 h-3.5 text-emerald-400" />
                              <span>استبدال الوسائط</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setActivityForm({
                                  ...activityForm,
                                  mediaUrl: '/assets/fruitsvegies10.jpg',
                                  mediaType: 'image',
                                })
                              }
                              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>العودة للافتراضي</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingActivityMedia(true);
                        }}
                        onDragLeave={() => setIsDraggingActivityMedia(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingActivityMedia(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleActivityMediaPicked(file);
                        }}
                        onClick={() => activityMediaInputRef.current?.click()}
                        className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-3 ${
                          isDraggingActivityMedia
                            ? 'border-emerald-600 bg-emerald-50 scale-[1.01]'
                            : 'border-[#D5CABB] hover:border-emerald-600 bg-[#F9F6F0] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white text-emerald-800 flex items-center justify-center shadow-xs border border-[#E7DECD]">
                          <Video className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C3322] mb-1">
                            اسحب ملف الصورة أو الفيديو هنا أو انقر للاختيار
                          </p>
                          <p className="text-xs text-[#50452d]">
                            يدعم الاستوديو ومكتبة الفيديو، التصوير المباشر، وملفات MP4 و WebM و JPG و PNG
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C3322] text-white text-xs font-bold shadow-xs">
                          <Upload className="w-4 h-4 text-emerald-400" />
                          <span>اختر ملف من جهازك</span>
                        </span>
                      </div>
                    )}

                    {isProcessingActivityMedia && (
                      <div className="text-center text-xs text-emerald-800 font-bold py-1">
                        جارٍ قراءة الملف وتحويله... ⏳
                      </div>
                    )}
                  </div>
                )}

                {/* Preset Activity Media Tab */}
                {activityMediaSourceTab === 'preset' && (
                  <div className="space-y-2">
                    <span className="text-[11px] text-[#50452d] block">
                      اختر من صور ومكتبة المزرعة المجهزة:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 p-3 rounded-2xl bg-[#F4EFE6] border border-[#E7DECD]">
                      {PRESET_ACTIVITY_MEDIA.map((item) => {
                        const isSelected = activityForm.mediaUrl === item.path;
                        return (
                          <button
                            key={item.path}
                            type="button"
                            onClick={() =>
                              setActivityForm({
                                ...activityForm,
                                mediaUrl: item.path,
                                mediaType: item.type,
                              })
                            }
                            className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group focus:outline-none cursor-pointer ${
                              isSelected
                                ? 'border-emerald-600 ring-2 ring-emerald-500 scale-95 shadow-md'
                                : 'border-transparent hover:border-emerald-400'
                            }`}
                            title={item.name}
                          >
                            <img
                              src={getAssetUrl(item.path)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-emerald-700/60 flex items-center justify-center text-white">
                                <Check className="w-5 h-5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Direct URL Tab */}
                {activityMediaSourceTab === 'url' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#1C3322]">
                      أدخل رابط ملف الوسائط المباشر (Direct Video / Image URL)
                    </label>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <input
                        type="text"
                        dir="ltr"
                        value={activityForm.mediaUrl}
                        onChange={(e) =>
                          setActivityForm({ ...activityForm, mediaUrl: e.target.value })
                        }
                        placeholder="https://example.com/farm-video.mp4 أو /assets/visitor11.jpg"
                        className="flex-1 px-3 py-2 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <span className="text-[11px] text-gray-500 block">
                      يدعم روابط الفيديو المباشرة بصيغة MP4 أو WebM، أو روابط الصور السحابية.
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-[#E7DECD] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActivityModalMode(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1C3322] hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>
                    {activityModalMode === 'add'
                      ? 'إضافة بطاقة النشاط فوراً'
                      : 'حفظ وتحديث البطاقة'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 3: ADD / EDIT CATEGORY MODAL                            */}
      {/* ============================================================= */}
      {categoryModalMode && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#E7DECD] shadow-2xl relative text-start space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DECD]">
              <div className="flex items-center gap-2">
                <Tags className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-black text-[#1C3322]">
                  {categoryModalMode === 'add' ? 'إضافة صنف جديد' : 'تعديل بيانات الصنف'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalMode(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1C3322] mb-1.5">
                  اسم الصنف بالعربية *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.nameAr}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })}
                  placeholder="مثال: فواكه موسمية"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C3322] mb-1.5">
                  English Category Name *
                </label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={categoryForm.nameEn}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
                  placeholder="e.g. Seasonal Fruits"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E7DECD] text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-sans"
                />
              </div>

              <div className="pt-3 border-t border-[#E7DECD] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCategoryModalMode(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1C3322] hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>{categoryModalMode === 'add' ? 'إضافة الصنف فوراً' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 4: DELETE PRODUCT CONFIRMATION DIALOG                   */}
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
                onClick={handleConfirmDeleteProduct}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>تأكيد الحذف</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 5: DELETE CATEGORY CONFIRMATION DIALOG                  */}
      {/* ============================================================= */}
      {categoryToDelete && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E7DECD] shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-[#1C3322]">
              هل أنت متأكد من حذف صنف "{categoryToDelete.nameAr}"؟
            </h3>
            <p className="text-xs text-[#50452d] leading-relaxed">
              {products.filter((p) => p.category === categoryToDelete.id).length > 0 ? (
                <>
                  تنبيه: يوجد حالياً{' '}
                  <strong className="text-amber-800">
                    {products.filter((p) => p.category === categoryToDelete.id).length} منتج
                  </strong>{' '}
                  مرتبط بهذا الصنف. سيتم حذف الصنف من تبويبات الفرز بالمتجر.
                </>
              ) : (
                'سيتم حذف هذا الصنف نهائياً من قائمة الأصناف.'
              )}
            </p>

            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>تأكيد حذف الصنف</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 6: DELETE ACTIVITY CARD CONFIRMATION DIALOG             */}
      {/* ============================================================= */}
      {activityToDelete && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E7DECD] shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-[#1C3322]">
              هل أنت متأكد من حذف بطاقة "{activityToDelete.titleAr}"؟
            </h3>
            <p className="text-xs text-[#50452d] leading-relaxed">
              سيتم حذف هذه البطاقة نهائياً من قسم الأنشطة والتجارب السياحية في الموقع.
            </p>

            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActivityToDelete(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteActivity}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>تأكيد حذف البطاقة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
