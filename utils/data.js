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