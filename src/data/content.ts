import { Product, BenefitVideo, GoogleReview, CategoryItem, ActivityCard } from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'veggies', nameAr: 'خضار وورقيات', nameEn: 'Fresh Vegetables & Greens', icon: 'Carrot' },
  { id: 'dairy', nameAr: 'ألبان وأجبان ريفية', nameEn: 'Farm Dairy & Cheeses', icon: 'Milk' },
  { id: 'honey-poultry', nameAr: 'عسل ودواجن وبيض', nameEn: 'Honey, Poultry & Eggs', icon: 'Egg' },
  { id: 'mushrooms-herbs', nameAr: 'فطريات وأعشاب واستنبات', nameEn: 'Sprouts, Mushrooms & Herbs', icon: 'Sprout' },
];

export const OFFICIAL_INFO = {
  nameAr: 'مؤسسة بيت الاستنبات للزراعة',
  nameEn: 'Istenbat House for Agriculture Establishment',
  brandNameAr: 'بيت الاستنبات',
  brandNameEn: 'Istenbat House Farm',
  parentGroupAr: 'إحدى منشآت مجموعة المدهان',
  parentGroupEn: 'A Member of Almudhan Group of Companies',
  taglineAr: 'رواد في مجالات الإنتاج النباتي والحيواني والخدمات الزراعية بالمملكة',
  taglineEn: 'Pioneers in Plant and Animal Production and Agricultural Services in the Kingdom',
  locationAr: 'طريق الملك عبدالله، الدلم 16312، المملكة العربية السعودية',
  locationEn: 'King Abdullah Rd, Ad Dilam 16312, Saudi Arabia',
  addressEn: 'King Abdullah Rd, Ad Dilam 16312, Saudi Arabia',
  cityAr: 'الدلم 16312، محافظة الخرج، المملكة العربية السعودية',
  cityEn: 'Ad Dilam 16312, Al Kharj Governorate, Saudi Arabia',
  phone: '0501207704',
  mobile: '0501207704',
  whatsapp: '+966501207704',
  whatsappRaw: '966501207704',
  emailInfo: 'info@istenbat.com.sa',
  emailCare: 'customercare@istenbat.com.sa',
  website: 'www.istenbat.com.sa',
  workingHoursAr: 'الأحد - الخميس: 9:00 ص إلى 6:00 م',
  workingHoursEn: 'Sunday - Thursday: 9:00 AM to 6:00 PM',
  visitHoursAr: 'الجمعة - السبت: 9:00 ص إلى 6:00 م',
  visitHoursEn: 'Friday - Saturday: 9:00 AM to 6:00 PM',
  socialLinks: {
    twitter: 'https://twitter.com/istenbat',
    youtube: 'https://www.youtube.com/@istenbathousefarm4016',
    instagram: 'https://www.instagram.com/istenbathousefarm/',
  },
  missionStatementAr:
    'مؤسسة بيت الاستنبات للزراعة هي إحدى المنشآت الرائدة في المنتجات الزراعية في المجالين النباتي والحيواني بالمملكة العربية السعودية. ومنذ تأسيسها، حملت على عاتقها مسؤولية المساهمة في تطوير وتنمية القطاع الزراعي في المملكة.',
  missionStatementEn:
    'Istenbat House for Agriculture Establishment is one of the pioneer establishments in agriculture product both in plant and animal fields in the Kingdom of Saudi Arabia. Since founded, it bore the responsibility of contributing in developing agriculture in the kingdom.',
};

export const TRUST_BADGES = [
  {
    id: 'sofa',
    titleAr: 'الجمعية السعودية للزراعة العضوية (SOFA)',
    titleEn: 'Saudi Organic Farming Association (SOFA)',
    codeAr: 'إنتاج عضوي معتمد',
    codeEn: 'Certified Organic Production',
    descAr: 'خاضعة لرقابة دورية وتفتيش حقلي لضمان الزراعة الطبيعية الخالية من المبيدات والكيماويات.',
    descEn: 'Subject to regular inspection and field audits ensuring chemical-free natural cultivation.',
    icon: 'Award',
  },
  {
    id: 'quality',
    titleAr: 'منتجات عالية الجودة',
    titleEn: 'Quality Products',
    codeAr: 'طزاجة وسلامة غذائية',
    codeEn: 'Freshness & Food Safety',
    descAr: 'التزام صارم بأعلى معايير الجودة، الطزاجة، والسلامة الغذائية والممارسات المسؤولة بيئياً.',
    descEn: 'Strict adherence to premium quality, freshness, and sustainable responsible practices.',
    icon: 'ShieldCheck',
  },
  {
    id: 'organic',
    titleAr: '100% إنتاج عضوي ومستدام',
    titleEn: '100% Organic & Sustainable',
    codeAr: 'صحة التربة والكمبوست الطبيعي',
    codeEn: 'Soil Health & Natural Compost',
    descAr: 'نعتمد البدائل الطبيعية كالكمبوست والدورة الزراعية والمكافحة الحيوية للحفاظ على صحة التربة.',
    descEn: 'We rely on compost, crop rotation, and biological alternatives to maintain soil vitality.',
    icon: 'CheckCircle2',
  },
  {
    id: 'eco-friendly',
    titleAr: 'صديق للبيئة والتنوع الحيوي',
    titleEn: 'Environmentally Friendly',
    codeAr: 'عمليات وتقنيات طبيعية',
    codeEn: 'Natural Processes & Biodiversity',
    descAr: 'تطبيق العمليات الطبيعية والتقنيات الصديقة للبيئة لحفظ التنوع الحيوي دون أي تعديل وراثي.',
    descEn: 'Utilizing natural techniques to preserve biodiversity without any GMO or harmful chemicals.',
    icon: 'QrCode',
  },
];

export const WHAT_WE_OFFER = [
  {
    id: 'fruits-veg',
    titleAr: 'خضار وفواكه عضوية طازجة',
    titleEn: 'Fresh Organic Fruits & Vegetables',
    descriptionAr:
      'استمتع بمتعة وتجربة قطف الفواكه والخضروات العضوية الطازجة بنفسك من الحقل مباشرة قبل دفع قيمتها.',
    descriptionEn:
      'Experience the joy of picking fresh organic fruits and vegetables straight from the field before paying for them.',
    image: '/assets/fruitsvegies10.jpg',
  },
  {
    id: 'flora-fauna',
    titleAr: 'النباتات والحيوانات (فلورا وفاونا)',
    titleEn: 'Flora & Fauna Experience',
    descriptionAr:
      'استكشف جمال نباتاتنا وزهورنا وأشجارنا؛ عش تجربة الاقتراب من النحل وخلاياه، واستمتع بصيد الأسماك والتواصل مع حيوانات المزرعة.',
    descriptionEn:
      'Explore beautiful botanical gardens, experience beekeeping up close, enjoy pond fishing, and interact with friendly farm animals.',
    image: '/assets/visitor03.jpg',
  },
  {
    id: 'camp-events',
    titleAr: 'المخيم ومناسباتكم الخاصة',
    titleEn: 'Campsite & Private Events',
    descriptionAr:
      'نوفر لكم مساحات تخييم مجهزة بالكامل؛ أقيموا مناسباتكم وفعالياتكم هنا للاسترخاء والاستجمام والاستمتاع بجمال الطبيعة.',
    descriptionEn:
      'Fully equipped outdoor camping grounds and serene spaces to host your private gatherings, family days, and celebrations.',
    image: '/assets/visitor11.jpg',
  },
];

export const ABOUT_STORY = {
  headlineAr: 'من نحن - رواد في مجالات الإنتاج النباتي والخدمات الزراعية',
  headlineEn: 'About Us - Leading Pioneers in Plant Production & Farm Services',
  overviewAr:
    'مزرعتنا إحدى المنشآت الرائدة في الإنتاج الزراعي بشقيه النباتي والحيواني بالمملكة العربية السعودية. تفتخر المزرعة ببيئتها الهادئة والآمنة، المليئة بالأنشطة المزرعية بعيداً عن الروتين الحضري المعتاد. ترتكز المزرعة على مناطقها وقطاعاتها الرئيسية التي تشمل: إنتاج الأعلاف الخضراء بنظام الاستنبات المائي، العسل الطبيعي، الخضار والفواكه العضوية الطازجة، البيض البلدي، الاستزراع السمكي، مواقع التخييم، النُزل والإقامة الريفية، أماكن النزهات، مسارات ركوب الدراجات، الألعاب الخارجية، والأنشطة الزراعية المتنوعة.',
  overviewEn:
    'Our farm is one of the pioneer establishments in agricultural production across both plant and animal fields in Saudi Arabia. We take pride in a tranquil, safe environment full of engaging farm activities away from urban routines. The farm features specialized zones including Hydroponic Green Fodder Production, Raw Honey, Fresh Organic Produce, Free-Range Eggs, Aquaculture, Campsites, Farmhouse Stay, Picnic Lawns, Cycling Tracks, and outdoor agricultural experiences.',
  invitationAr:
    'سواء كنت فرداً، عائلة، مجموعة أصدقاء، أو ضمن رحلات وجولات سياحية منظمة؛ فإن مزرعة ونُزل بيت الاستنبات ترحب بكم لقضاء عطلة نهاية أسبوع ممتعة أو يوم كامل في الهواء الطلق مع فرصة قطف المحاصيل، رعاية الحيوانات، صيد الأسماك، أو الاسترخاء والهدوء في الطبيعة.',
  invitationEn:
    'Whether you visit as an individual, family, group of colleagues, or guided tour, Istenbat Farmhouse welcomes you for refreshing weekend getaways or full-day outdoor excursions filled with harvesting, animal care, fishing, and pure rural relaxation.',
  fourPillars: [
    {
      titleAr: 'منتجات عالية الجودة',
      titleEn: 'Quality Products',
      descAr:
        'نتميز بالتزامنا الصارم بأعلى معايير الجودة، الطزاجة، السلامة والاستدامة. منتجاتنا ومحاصيلنا تُزرع وتُنتج في مزارعنا مع إعطاء الأولوية للممارسات الأخلاقية والمسؤولة بيئياً.',
      descEn:
        'We are committed to the highest standards of quality, freshness, safety, and sustainability, prioritizing ethical and environmentally responsible farming practices.',
    },
    {
      titleAr: 'المكان المثالي للاستجمام',
      titleEn: 'Perfect Countryside Retreat',
      descAr:
        'استرخِ بعيداً عن صخب وضغوط المدينة بالإقامة في بيت الاستنبات، واستمتع بتجربة ريفية متكاملة تتذوق خلالها العسل الصافي، البيض البلدي، الأسماك، والخضار والفواكه العضوية.',
      descEn:
        'Unwind from the pressures of city life at Istenbat Farmhouse, enjoying an authentic farm stay complete with fresh raw honey, free-range eggs, fresh fish, and organic produce.',
    },
    {
      titleAr: '100% إنتاج عضوي',
      titleEn: '100% Organic Production',
      descAr:
        'نضع صحة التربة على رأس أولوياتنا، ونعتمد البدائل الطبيعية مثل التسميد العضوي، الدورة الزراعية، والمكافحة الحيوية للآفات لبناء تربة خصبة وغنية بالمغذيات.',
      descEn:
        'We prioritize soil health through natural composting, crop rotation, and biological pest control to build fertile, nutrient-dense organic soils.',
    },
    {
      titleAr: 'صديق للبيئة ومستدام',
      titleEn: 'Environmentally Friendly & Sustainable',
      descAr:
        'نؤكد على استخدام العمليات الطبيعية والممارسات المستدامة التي تحافظ على توازن البيئة والتنوع الحيوي، بعيداً عن أي مبيدات صناعية أو كائنات معدلة وراثياً.',
      descEn:
        'We harness natural biological processes and eco-friendly techniques to preserve local biodiversity, completely free of synthetic pesticides or GMOs.',
    },
  ],
};

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: 'review-1',
    author: 'Lingchia Chang',
    badgeAr: 'زائر موثق • Google Maps',
    badgeEn: 'Verified Visitor • Google Maps',
    rating: 5,
    textAr:
      'مزرعة مذهلة تجد فيها الخضار الطازجة، البيض، الحليب، والزبدة وأكثر من ذلك. كل المنتجات عضوية، لذيذة وصحية للغاية. أنصح بزيارتها بشدة!',
    textEn:
      'Amazing farm! You can get vegetables, eggs, milk, butter, and more here. Everything is not only organic but also delicious and healthy. Highly recommended!',
  },
  {
    id: 'review-2',
    author: 'One Plus 3t',
    badgeAr: 'مرشد محلي (Local Guide) • Google Maps',
    badgeEn: 'Local Guide • Google Maps',
    rating: 4,
    textAr:
      'مكان رائع وممتع لقضاء ساعتين إلى 3 ساعات كحد أقصى.. تتوفر بحيرة صغيرة للأسماك وخضار طازجة داخل البيوت المحمية يمكنك قطفها وشراؤها مباشرة.',
    textEn:
      'Great place. One can spend 2 hrs.. max 3 hours.. Small pond with fish, some fresh vegetables in greenhouses.. you can pick and buy it.',
  },
  {
    id: 'review-3',
    author: 'syed masood ali haja mohideen',
    badgeAr: 'زائر موثق • Google Maps',
    badgeEn: 'Verified Visitor • Google Maps',
    rating: 5,
    textAr:
      'فريق العمل هنا في غاية اللطف والتعاون، ويقدمون المساعدة بكل رحابة صدر، والحمد لله.',
    textEn:
      'People working here are very kind and friendly and helped. Alhamdhulillah.',
  },
  {
    id: 'review-4',
    author: 'muhammed Zaheeruddin',
    badgeAr: 'مرشد محلي (Local Guide) • Google Maps',
    badgeEn: 'Local Guide • Google Maps',
    rating: 5,
    textAr:
      'مكان جميل ومميز جداً للزيارة، تتوفر فيه كافة المرافق المناسبة لمتعة الأطفال واستضافة لقاءات العائلات والمجموعات.',
    textEn:
      'Very nice place to visit with all facilities and enjoyment for children and group gathering, a very best place.',
  },
];

export const VLOGGERS_TESTIMONIALS = [
  {
    name: 'McCoy Gueco',
    quoteAr: '«المزرعة الجميلة والخلابة في قلب الصحراء»',
    quoteEn: '“The beautiful farm in the middle of the desert”',
    roleAr: 'صانع محتوى وزائر للمزرعة',
    roleEn: 'Content Creator & Farm Visitor',
  },
  {
    name: 'Johnrob Otoy',
    quoteAr: '«أماكن رائعة وممتعة للاستكشاف والاسترخاء وقضاء عطلة نهاية الأسبوع»',
    quoteEn: '“Enjoyable, inspiring and relaxing place to spend the weekend”',
    roleAr: 'موثق تجارب سياحية',
    roleEn: 'Travel & Tourism Blogger',
  },
  {
    name: 'Jiby George',
    quoteAr:
      '«دع عائلتك وأصدقاءك يخوضون تجربة استثنائية لجمال وسحر الطبيعة في المزرعة. تواصل وتآلف مع أحبائك، وتذوق طزاجة خضرواتنا ومحاصيلنا، واستمتع بالاسترخاء بعيداً عن المدينة.»',
    quoteEn:
      '“Let your family and friends experience the true beauty and serenity of the farm. Bond with loved ones, savor harvest freshness, and recharge away from city rush.”',
    roleAr: 'زائر ومحب للطبيعة الريفية',
    roleEn: 'Visitor & Countryside Enthusiast',
  },
];

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: 'honey-bee',
    nameAr: 'عسل النحل الطبيعي النقي',
    nameEn: 'Pure Raw Natural Honey',
    category: 'honey-poultry',
    categoryLabelAr: 'العسل والدواجن',
    categoryLabelEn: 'Honey & Poultry',
    weightAr: '500 جم',
    weightEn: '500g Jar',
    descriptionAr: 'عسل سدر وزهور طبيعي خام غير مبستر مستخلص مباشرة من خلايا النحل في مزارعنا بالدلم.',
    descriptionEn: 'Pure raw, unpasteurized Sidr and floral honey harvested directly from our apiaries in Ad Dilam.',
    benefitsAr: ['عسل طبيعي نقي 100%', 'مستخلص من مناحل المزرعة بالدلم', 'غني بالإنزيمات الحية المفيدة'],
    benefitsEn: ['100% Pure Natural Honey', 'Harvested from Ad Dilam Apiaries', 'Rich in Live Beneficial Enzymes'],
    image: '/assets/prod01a.png',
    isCertifiedOrganic: true,
    badgeAr: 'طبيعي 100%',
    badgeEn: '100% Natural',
  },
  {
    id: 'hydroponic-sprout',
    nameAr: 'المستنبتات المائية والشعير المستنبت',
    nameEn: 'Hydroponic Green Sprout & Fodder',
    category: 'mushrooms-herbs',
    categoryLabelAr: 'الفطريات والأعشاب',
    categoryLabelEn: 'Sprouts & Herbs',
    weightAr: 'حسب الطلب',
    weightEn: 'Upon Request',
    descriptionAr: 'أعلاف خضراء ومستنبتات طبيعية تنتج بتقنية الاستنبات المائي المتقدم لضمان أعلى قيمة غذائية خالية من أي ملوثات.',
    descriptionEn: 'High-nutrient organic sprouts and barley fodder grown using state-of-the-art clean hydroponic systems.',
    benefitsAr: ['تقنية الاستنبات المائي الخضراء', 'قيمة غذائية مركزة ونظيفة', 'إنتاج يومي طازج'],
    benefitsEn: ['Advanced Green Hydroponics', 'Concentrated Clean Nutrients', 'Fresh Daily Harvest'],
    image: '/assets/flora11.jpg',
    isCertifiedOrganic: true,
    badgeAr: 'استنبات مائي',
    badgeEn: 'Hydroponic',
  },
  {
    id: 'oyster-mushroom',
    nameAr: 'فطر المحار العضوي الطازج',
    nameEn: 'Fresh Organic Oyster Mushroom',
    category: 'mushrooms-herbs',
    categoryLabelAr: 'الفطريات والأعشاب',
    categoryLabelEn: 'Mushrooms & Herbs',
    weightAr: '150 جم',
    weightEn: '150g Box',
    descriptionAr: 'فطر محار عضوي يزرع في بيئة معقمة ومحكمة بالكامل في غرف الاستنبات، غني بالبروتين ومضادات الأكسدة.',
    descriptionEn: 'Fresh gourmet oyster mushrooms cultivated in sterile, climate-controlled chambers, rich in plant protein.',
    benefitsAr: ['سوبر فود مناعي ممتاز', 'بديل بروتيني نباتي طازج', 'خالٍ تماماً من أي كيماويات'],
    benefitsEn: ['Immune Boosting Superfood', 'Clean Plant-Based Protein', '100% Chemical Free'],
    image: '/assets/mushroom-placeholder.jpg',
    isCertifiedOrganic: true,
    badgeAr: 'سوبر فود',
    badgeEn: 'Superfood',
  },
  {
    id: 'cherry-tomatoes',
    nameAr: 'طماطم كرزية شيري طازجة',
    nameEn: 'Fresh Sweet Cherry Tomatoes',
    category: 'veggies',
    categoryLabelAr: 'الخضار والورقيات',
    categoryLabelEn: 'Vegetables & Greens',
    weightAr: '500 جم',
    weightEn: '500g Pack',
    descriptionAr: 'طماطم كرزية عضوية حلوة المذاق تُقطف يومياً من البيوت المحمية في مزرعتنا بالدلم.',
    descriptionEn: 'Naturally sweet organic cherry tomatoes hand-picked daily from our greenhouses in Ad Dilam.',
    benefitsAr: ['غنية بمضاد الأكسدة الليكوبين', 'طعم حلو وطازج للسلطات', 'قطف فوري طازج'],
    benefitsEn: ['Rich in Lycopene Antioxidants', 'Crisp & Naturally Sweet', 'Immediate Daily Harvest'],
    image: '/assets/fruitsvegies10.jpg',
    isCertifiedOrganic: true,
    badgeAr: 'قطف يومي',
    badgeEn: 'Daily Harvest',
  },
  {
    id: 'native-eggs',
    nameAr: 'بيض دجاج بلدي طازج',
    nameEn: 'Farm-Fresh Free-Range Eggs',
    category: 'honey-poultry',
    categoryLabelAr: 'العسل والدواجن',
    categoryLabelEn: 'Honey & Poultry',
    weightAr: 'طبق 30 بيضة',
    weightEn: 'Tray of 30 Eggs',
    descriptionAr: 'بيض بلدي طازج من دجاج يرعى حراً في حظائر المزرعة ويتغذى على الحبوب والأعلاف الطبيعية.',
    descriptionEn: 'Country fresh eggs from pasture-raised hens roaming freely and fed organic grains and sprouts.',
    benefitsAr: ['دجاج يرعى بحرية تامة', 'تغذية طبيعية خالية من الهرمونات', 'طازج يجمع يومياً'],
    benefitsEn: ['100% Free-Range Pasture Birds', 'No Hormones or Antibiotics', 'Gathered Fresh Every Morning'],
    image: '/assets/prod18a.png',
    isCertifiedOrganic: true,
    badgeAr: 'دجاج بلدي حر',
    badgeEn: 'Free-Range',
  },
  {
    id: 'moringa',
    nameAr: 'أوراق المورينجا الطازجة والمجففة',
    nameEn: 'Fresh & Dried Moringa Leaves',
    category: 'mushrooms-herbs',
    categoryLabelAr: 'الفطريات والأعشاب',
    categoryLabelEn: 'Sprouts & Herbs',
    weightAr: '200 جم',
    weightEn: '200g Pack',
    descriptionAr: 'شجرة المعجزة المزروعة في تربة الدلم الغنية بمضادات الأكسدة والفيتامينات المقوية للجسم.',
    descriptionEn: 'Miracle tree leaves cultivated in Ad Dilam soil, loaded with dense vitamins, minerals, and polyphenols.',
    benefitsAr: ['غنية بالفيتامينات والمعادن', 'تعزيز الحيوية والنشاط', 'مجففة طبيعياً بدون حرارة عالية'],
    benefitsEn: ['Abundant Micronutrients', 'Vitality & Daily Energy', 'Air-Dried to Preserve Nutrients'],
    image: '/assets/prod17a.png',
    isCertifiedOrganic: true,
    badgeAr: 'شجرة الحياة',
    badgeEn: 'Tree of Life',
  },
  {
    id: 'cucumber',
    nameAr: 'خيار عضوي مقرمش طازج',
    nameEn: 'Fresh Crisp Organic Cucumbers',
    category: 'veggies',
    categoryLabelAr: 'الخضار والورقيات',
    categoryLabelEn: 'Vegetables & Greens',
    weightAr: '1 كجم',
    weightEn: '1kg Basket',
    descriptionAr: 'خيار مقرمش طازج مزروع وفق معايير الزراعة العضوية النظيفة دون أي مبيدات صناعية.',
    descriptionEn: 'Crisp, hydrating cucumbers farmed under clean organic protocols without chemical pesticides.',
    benefitsAr: ['طعم ندي ومقرمش', '100% خالٍ من المبيدات', 'مثالي للحمية والصحة'],
    benefitsEn: ['Fresh & Crunchy Texture', '100% Residue Free', 'Hydrating & Healthy Snack'],
    image: '/assets/fruitsvegies01.jpg',
    isCertifiedOrganic: true,
    badgeAr: 'طازج وعضوي',
    badgeEn: 'Fresh & Organic',
  },
  {
    id: 'chili-peppers',
    nameAr: 'فلفل حار بلدي طازج',
    nameEn: 'Fresh Native Hot Chili Peppers',
    category: 'veggies',
    categoryLabelAr: 'الخضار والورقيات',
    categoryLabelEn: 'Vegetables & Greens',
    weightAr: '500 جم',
    weightEn: '500g Pack',
    descriptionAr: 'فلفل حار بلدي مزروع في حقول الدلم المفتوحة تحت أشعة الشمس الطبيعية بنكهة أصيلة وقوية.',
    descriptionEn: 'Sun-ripened native chili peppers grown in Ad Dilam fields with authentic fiery flavor.',
    benefitsAr: ['غني بمركب الكابسيسين المحفز', 'نكهة بلدية أصيلة', 'قطف مباشر من المزرعة'],
    benefitsEn: ['Rich in Natural Capsaicin', 'Vibrant Traditional Flavor', 'Direct Field Harvest'],
    image: '/assets/prod11a.png',
    isCertifiedOrganic: true,
    badgeAr: 'حصاد حقلي',
    badgeEn: 'Field Harvest',
  },
  {
    id: 'halloumi',
    nameAr: 'جبنة حلومي يوناني طازجة',
    nameEn: 'Fresh Artisanal Halloumi Cheese',
    category: 'dairy',
    categoryLabelAr: 'الأجبان الحرفية',
    categoryLabelEn: 'Artisanal Cheeses',
    weightAr: '250 جم',
    weightEn: '250g Block',
    descriptionAr: 'حليبي حرفي طازج محضر في معمل المزرعة من حليب طبيعي صافٍ، مثالية للشواء والتحمير.',
    descriptionEn: 'Handcrafted halloumi cheese made in our farm creamery from pure whole milk, perfect for grilling.',
    benefitsAr: ['طازجة تصنع يومياً بالمعمل', 'بدون أي مواد حافظة أو زيوت', 'قوام متماسك وطعم متوازن'],
    benefitsEn: ['Crafted Fresh in Creamery', 'No Preservatives or Fillers', 'Firm Texture & Balanced Salt'],
    image: '/assets/dairy-halloumi.jpg',
    isCertifiedOrganic: true,
    badgeAr: 'معمل المزرعة',
    badgeEn: 'Farm Creamery',
  },
  {
    id: 'akkawi',
    nameAr: 'جبنة عكاوي بلدية طازجة',
    nameEn: 'Fresh Artisanal Akkawi Cheese',
    category: 'dairy',
    categoryLabelAr: 'الأجبان الحرفية',
    categoryLabelEn: 'Artisanal Cheeses',
    weightAr: '250 جم',
    weightEn: '250g Block',
    descriptionAr: 'جبنة بلدية طازجة قليلة الملوحة محضرة بالطريقة التقليدية الصافية، تحتفظ بنكهة الحليب الطبيعية.',
    descriptionEn: 'Mild, delicate artisanal Akkawi cheese prepared traditionally from 100% fresh natural milk.',
    benefitsAr: ['قليلة الملوحة ومناسبة للوجبات', 'حليب طازج نقي 100%', 'مصنوعة يدوياً بحرفية'],
    benefitsEn: ['Mild Salt, Perfect for Baking', '100% Pure Fresh Milk', 'Artisanal Hand-Stretched'],
    image: '/assets/dairy-akkawi.jpg',
    isCertifiedOrganic: true,
    badgeAr: 'طازج يومياً',
    badgeEn: 'Fresh Daily',
  },
];

export const HEALTH_VIDEOS: BenefitVideo[] = [
  {
    id: 'vB5CVoS2lG4',
    titleAr: 'اكتشف الفوائد الصحية المذهلة لفطر المحار',
    titleEn: 'Unlock the Amazing Health Benefits of Oyster Mushrooms',
    subtitleAr: 'دليل غذائي شامل لأهمية فطر المحار في تعزيز المناعة والطاقة الحيوية',
    subtitleEn: 'Comprehensive guide to how oyster mushrooms boost immune health and daily energy',
    youtubeId: 'vB5CVoS2lG4',
    durationAr: '4:20 دقيقة',
    durationEn: '4:20 min',
    thumbnail: '/assets/mushroom-placeholder.jpg',
    categoryAr: 'فطر المحار والأغذية الخارقة',
    categoryEn: 'Oyster Mushrooms & Superfoods',
  },
  {
    id: '1WdAaYcuy18',
    titleAr: 'فوائد العسل الطبيعي لصحة ونشاط الجسم',
    titleEn: 'Sweet Health Benefits of Pure Natural Honey',
    subtitleAr: 'أسرار الشفاء ومضادات الأكسدة في عسل النحل الخام غير المبستر',
    subtitleEn: 'Healing secrets and live enzymes inside raw unpasteurized natural honey',
    youtubeId: '1WdAaYcuy18',
    durationAr: '5:15 دقيقة',
    durationEn: '5:15 min',
    thumbnail: '/assets/prod01a.png',
    categoryAr: 'عسل النحل الطبيعي',
    categoryEn: 'Natural Bee Honey',
  },
  {
    id: 'KiUS8XgUT8Q',
    titleAr: 'لماذا يعتبر البروكلي غذاءً خارقاً تحتاجه دائماً؟',
    titleEn: 'Why Broccoli is the Ultimate Superfood You Need',
    subtitleAr: 'خصائص مركب السلفورافين في حماية الخلايا ودعم الصحة العامة',
    subtitleEn: 'How sulforaphane and vital antioxidants in broccoli support overall wellness',
    youtubeId: 'KiUS8XgUT8Q',
    durationAr: '3:50 دقيقة',
    durationEn: '3:50 min',
    thumbnail: '/assets/flora11.jpg',
    categoryAr: 'الخضار الورقية والأغذية الخارقة',
    categoryEn: 'Leafy Greens & Superfoods',
  },
  {
    id: 'osEzuoU6iK0',
    titleAr: 'طاقة الطماطم: 5 فوائد صحية مدهشة',
    titleEn: 'Tomato Power: 5 Surprising Health Benefits',
    subtitleAr: 'أهمية الليكوبين والفيتامينات الطبيعية في الطماطم العضوية الطازجة',
    subtitleEn: 'The health power of natural lycopene and essential vitamins in fresh tomatoes',
    youtubeId: 'osEzuoU6iK0',
    durationAr: '4:45 دقيقة',
    durationEn: '4:45 min',
    thumbnail: '/assets/fruitsvegies10.jpg',
    categoryAr: 'الطماطم والبيوت المحمية',
    categoryEn: 'Greenhouse Vine Tomatoes',
  },
];

export const INITIAL_ACTIVITIES: ActivityCard[] = [
  {
    id: 'harvest',
    titleAr: 'قطف الفواكه والخضروات العضوية الطازجة',
    titleEn: 'Fresh Organic Fruit & Vegetable Picking',
    tagAr: 'قطف فوري قبل الدفع',
    tagEn: 'Pick Fresh Before Paying',
    descriptionAr:
      'استمتع بمتعة وتجربة قطف الفواكه والخضروات العضوية الطازجة بنفسك من الحقل مباشرة قبل دفع قيمتها.',
    descriptionEn:
      'Experience the thrill of picking vine-fresh organic vegetables and seasonal fruits directly in the open fields before checkout.',
    mediaType: 'image',
    mediaUrl: '/assets/fruitsvegies10.jpg',
    detailsAr: [
      'قطف مباشر من البيوت المحمية والحقول المفتوحة',
      'سلة قطف شخصية وتذوق للمحاصيل الطازجة',
      'نشاط ممتع وتثقيفي للأطفال والعائلات',
    ],
    detailsEn: [
      'Direct harvesting from greenhouses and open fields',
      'Personal harvest basket and fresh produce tasting',
      'Fun, educational activity for kids and whole families',
    ],
  },
  {
    id: 'flora-fauna',
    titleAr: 'النباتات والحيوانات: فلورا وفاونا',
    titleEn: 'Flora & Fauna Countryside Experience',
    tagAr: 'مناحل، أسماك وحيوانات المزرعة',
    tagEn: 'Bees, Fishing & Farm Animals',
    descriptionAr:
      'استكشف جمال نباتاتنا وزهورنا وأشجارنا. عش تجربة الاقتراب من النحل وخلاياه، واستمتع بصيد الأسماك والتواصل مع حيوانات المزرعة.',
    descriptionEn:
      'Explore blooming gardens, experience beekeeping beside hive shelters, try recreational pond fishing, and feed farm animals safely.',
    mediaType: 'image',
    mediaUrl: '/assets/visitor03.jpg',
    detailsAr: [
      'الاقتراب الآمن من خلايا النحل ومناحل العسل',
      'تجربة صيد الأسماك في بحيرة الاستزراع السمكي',
      'إطعام وتفاعل مع حيوانات المزرعة في بيئة آمنة',
    ],
    detailsEn: [
      'Safe guided approach to beehives and apiary zones',
      'Recreational fishing at our fresh aquaculture pond',
      'Feeding and meeting friendly farm livestock',
    ],
  },
  {
    id: 'family-activities',
    titleAr: 'أنشطة الأفراد، العائلات والمجموعات',
    titleEn: 'Activities for Individuals, Families & Groups',
    tagAr: 'أنشطة مخصصة للجميع',
    tagEn: 'Tailored for Every Occasion',
    descriptionAr:
      'سواء كنت فرداً، عائلة، أو مجموعة أصدقاء أو رحلات مدرسية منظمة؛ نصنع لك تجربة ريفية متكاملة تناسب وقتك وتطلعاتك.',
    descriptionEn:
      'From weekend getaways to full-day educational school visits and group bonding outings, we curate your ideal farm itinerary.',
    mediaType: 'image',
    mediaUrl: '/assets/visitor06.jpg',
    detailsAr: [
      'برامج قضاء عطلة نهاية الأسبوع المنعشة',
      'برامج اليوم الكامل بالهواء الطلق مع وجبات طازجة',
      'إقامة ريفية ممتدة في نُزل المزرعة',
    ],
    detailsEn: [
      'Refreshing weekend escape programs',
      'Full-day outdoor itineraries with farm-fresh tastings',
      'Extended countryside stays at Istenbat Farmhouse',
    ],
  },
  {
    id: 'camp-events',
    titleAr: 'استجمام وأجواء طبيعية هادئة / فعاليات خاصة',
    titleEn: 'Campsite, Tranquil Nature & Private Events',
    tagAr: 'استجمام وأجواء طبيعية هادئة',
    tagEn: 'Serene Nature & Starlit Nights',
    descriptionAr:
      'نوفر لكم مساحات تخييم مجهزة بالكامل؛ أقيموا فعالياتكم ومناسباتكم الخاصة هنا للاسترخاء والاستجمام والتمتع بجمال الطبيعة.',
    descriptionEn:
      'Fully equipped scenic desert-edge camp spots where you can host family gatherings, retreats, and evening bonfires.',
    mediaType: 'image',
    mediaUrl: '/assets/visitor11.jpg',
    detailsAr: [
      'مواقع تخييم مجهزة ونُزل إقامة ريفية مريحة',
      'مسارات لركوب الدراجات وألعاب وأنشطة خارجية',
      'جلسات ضيافة نجدية وقهوة وشاي على الحطب',
    ],
    detailsEn: [
      'Equipped camping pitches and peaceful farmhouse lodging',
      'Cycling tracks and open outdoor spaces',
      'Traditional Saudi hospitality with firewood tea and coffee',
    ],
  },
];

export const AGRITOURISM_ACTIVITIES = INITIAL_ACTIVITIES.map((act) => ({
  ...act,
  image: act.mediaUrl,
}));

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${OFFICIAL_INFO.whatsappRaw}?text=${encoded}`;
}
