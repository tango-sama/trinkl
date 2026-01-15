// Desert Shop Data
const categories = [
    { id: "pheromones", name: "عطور فرمونية", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400" },
    { id: "vagina_care", name: "العناية بالمهبل", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400" },
    { id: "butt_enlargement", name: "منتجات تكبير المؤخرة", image: "https://images.unsplash.com/photo-1518818419601-72c83366fad9?auto=format&fit=crop&q=80&w=400" },
    { id: "breast_enlargement", name: "منتجات تكبير الصدر", image: "https://images.unsplash.com/photo-1522337360705-8763d84a783a?auto=format&fit=crop&q=80&w=400" },
    { id: "skin_care", name: "العناية بالبشرة", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400" },
    { id: "hair_care", name: "منتجات العناية بالشعر", image: "https://images.unsplash.com/photo-1519699047748-40ba5267930b?auto=format&fit=crop&q=80&w=400" },
    { id: "slimming", name: "منتجات تنحيف", image: "https://images.unsplash.com/photo-1511611359134-4deb56379a59?auto=format&fit=crop&q=80&w=400" },
    { id: "fattening", name: "منتجات تسمين", image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400" }
];

const products = [
    {
        id: 1,
        title: "زيت الأرغان الأصلي",
        subtitle: "لعلاج تساقط الشعر وتكثيفه",
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=400",
        price: "2500 DA",
        category: "hair_care",
        description: "زيت أرغان نقي 100% مستورد، يساعد في تقوية بصيلات الشعر ومنع التساقط."
    },
    {
        id: 2,
        title: "كريم تكبير المناطق الأنثوية",
        subtitle: "نتائج سريعة وآمنة",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
        price: "1800 DA",
        category: "butt_enlargement",
        description: "تركيبة طبيعية تساعد على زيادة الحجم بشكل متناسق."
    },
    {
        id: 3,
        title: "عطر الجاذبية",
        subtitle: "عطر فرموني مركز",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400",
        price: "3200 DA",
        category: "pheromones",
        description: "عطر جذاب يدوم طويلاً، مصمم لإضافة لمسة من السحر."
    },
    {
        id: 4,
        title: "مجموعة العناية بالبشرة",
        subtitle: "روتين متكامل للنضارة",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400",
        price: "4500 DA",
        category: "skin_care",
        description: "مجموعة تحتوي على غسول، تونر، ومرطب للبشرة الحساسة."
    },
];

const features = [
    { id: 1, title: "الدفع عند الإستلام", subtitle: "توصيل لـ 58 ولاية", icon: "banknote" },
    { id: 2, title: "منتجات أصلية", subtitle: "ضمان الجودة 100%", icon: "shield-check" },
    { id: 3, title: "توصيل سريع", subtitle: "إلى باب المنزل", icon: "truck" },
    { id: 4, title: "خدمة زبائن", subtitle: "7/7 أيام", icon: "headset" }
];

const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
    "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers",
    "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
    "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
    "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
    "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès",
    "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

// Expose data globally (Safeguard)
window.categories = categories;
window.products = products;
window.features = features;
window.wilayas = wilayas;


// --- Icons Configuration (Merged from Icons.js) ---
const IconBase = ({ children, className = "", ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        {children}
    </svg>
);

const IconShoppingCart = (props) => (
    <IconBase {...props}>
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </IconBase>
);

const IconSparkles = (props) => (
    <IconBase {...props}>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
    </IconBase>
);

const IconHeadset = (props) => (
    <IconBase {...props}>
        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
        <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
    </IconBase>
);

const IconTruck = (props) => (
    <IconBase {...props}>
        <path d="M5 18h14" /><path d="M12 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
    </IconBase>
);

const IconShieldCheck = (props) => (
    <IconBase {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
    </IconBase>
);

const IconBanknote = (props) => (
    <IconBase {...props}>
        <rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" />
    </IconBase>
);

const IconMenu = (props) => (
    <IconBase {...props}>
        <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
    </IconBase>
);

const IconX = (props) => (
    <IconBase {...props}>
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </IconBase>
);

const IconPlus = (props) => (
    <IconBase {...props}>
        <path d="M5 12h14" /><path d="M12 5v14" />
    </IconBase>
);

const IconMinus = (props) => (
    <IconBase {...props}>
        <path d="M5 12h14" />
    </IconBase>
);

const IconTrash2 = (props) => (
    <IconBase {...props}>
        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
    </IconBase>
);

const IconArrowLeft = (props) => (
    <IconBase {...props}>
        <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
    </IconBase>
);

const IconMessageCircle = (props) => (
    <IconBase {...props}>
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </IconBase>
);

// Map for Features dynamic rendering
const IconMap = {
    'shopping-cart': IconShoppingCart,
    'sparkles': IconSparkles,
    'headset': IconHeadset,
    'truck': IconTruck,
    'shield': IconShieldCheck,
    'shield-check': IconShieldCheck,
    'banknote': IconBanknote,
    'menu': IconMenu,
    'x': IconX,
    'plus': IconPlus,
    'minus': IconMinus,
    'trash-2': IconTrash2,
    'arrow-left': IconArrowLeft,
    'message-circle': IconMessageCircle
};

window.Icons = {
    ...IconMap,
    IconArrowLeft,
    IconMessageCircle,
    IconMap // Expose map for dynamic lookup
};