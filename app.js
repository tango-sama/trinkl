// --- Icons Configuration ---
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
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
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
    IconMap
};

// Error Boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('App Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-800 p-4 text-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">عذراً، حدث خطأ ما</h1>
                        <p>يرجى تحديث الصفحة أو المحاولة لاحقاً</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Extracted Components to prevent re-mounting on state changes
const Layout = ({ children, cartCount }) => {
    const { useLocation } = ReactRouterDOM;
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/amelhadj');

    return (
        <div className="min-h-screen flex flex-col">
            <Header cartCount={cartCount} />
            <main className="flex-grow">
                {children}
            </main>
            {!isAdmin && <WhatsAppFloat />}
            <Footer isAdmin={isAdmin} />
        </div>
    );
};

const HomePage = () => (
    <React.Fragment>
        <Hero />
        <Features />
        <ProductGrid />
    </React.Fragment>
);

const CheckoutWrapper = ({ cart }) => window.CheckoutPage ? <CheckoutPage cart={cart} /> : <div className="p-10 text-center">جاري تحميل صفحة الدفع...</div>;
const CategoryPageWrapper = () => window.CategoryPage ? <CategoryPage /> : <div className="p-10 text-center">جاري تحميل صفحة التصنيف...</div>;
const CategoriesPageWrapper = () => window.CategoriesPage ? <CategoriesPage /> : <div className="p-10 text-center">جاري تحميل صفحة التصنيفات...</div>;
const ProductPageWrapper = () => window.ProductPage ? <ProductPage /> : <div className="p-10 text-center">جاري تحميل صفحة المنتج...</div>;
const ContactPageWrapper = () => window.ContactPage ? <ContactPage /> : <div className="p-10 text-center">جاري تحميل صفحة اتصل بنا...</div>;
const AdminPageWrapper = () => window.AdminPage ? <AdminPage /> : <div className="p-10 text-center">جاري تحميل لوحة التحكم...</div>;

const ScrollToTop = () => {
    const { pathname } = ReactRouterDOM.useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    const { HashRouter, Routes, Route } = ReactRouterDOM;

    const [loading, setLoading] = React.useState(true);

    // Cart State
    const [cart, setCart] = React.useState([]);
    // Cart Drawer State
    const [isCartOpen, setIsCartOpen] = React.useState(false);
    const [lastAddedId, setLastAddedId] = React.useState(null);

    React.useEffect(() => {
        const initializeData = async () => {
            try {
                // Fetch Categories
                let dbCategories = await window.db.getCollection('categories');
                if (dbCategories.length === 0 && window.categories && window.categories.length > 0) {
                    for (const cat of window.categories) {
                        await window.db.addDocument('categories', cat);
                    }
                    dbCategories = window.categories;
                } else if (dbCategories.length > 0) {
                    window.categories = dbCategories;
                }

                // Fetch Products
                let dbProducts = await window.db.getCollection('products');
                if (dbProducts.length === 0 && window.products && window.products.length > 0) {
                    for (const prod of window.products) {
                        await window.db.addDocument('products', prod);
                    }
                    dbProducts = window.products;
                } else if (dbProducts.length > 0) {
                    window.products = dbProducts;
                }

                // Fetch Site Settings
                try {
                    const settingsDocs = await window.db.getCollection('site_settings');
                    if (settingsDocs && settingsDocs.length > 0) {
                        window.siteSettings = settingsDocs[0];
                    } else {
                        window.siteSettings = {};
                    }
                } catch (err) {
                    console.error("Failed to fetch settings", err);
                    window.siteSettings = {};
                }

                setLoading(false);
            } catch (error) {
                console.error("Failed to initialize data:", error);
                setLoading(false);
            }
        };

        if (window.db) {
            initializeData();
        } else {
            setLoading(false);
        }
    }, []);

    // Load Cart
    React.useEffect(() => {
        const saved = localStorage.getItem('trinkl_cart');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setCart(parsed);
                } else {
                    console.warn("Corrupt cart data found, resetting.");
                    setCart([]);
                }
            } catch (e) {
                console.error('Cart parse error', e);
                setCart([]);
            }
        }
    }, []);

    // Save Cart & Expose Global Methods
    React.useEffect(() => {
        localStorage.setItem('trinkl_cart', JSON.stringify(cart));

        // Global Add To Cart (Available anywhere)
        window.addToCart = (product) => {
            setLastAddedId(product.id);
            setCart(prev => {
                const existing = prev.find(p => p.id === product.id);
                if (existing) {
                    return prev.map(p => p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p);
                }
                return [...prev, { ...product, quantity: 1 }];
            });
            setIsCartOpen(true); // Open Drawer
        };

        window.openCart = () => setIsCartOpen(true);
        window.closeCart = () => setIsCartOpen(false);

        window.decreaseQuantity = (productId) => {
            setCart(prev => {
                const existing = prev.find(p => p.id === productId);
                if (existing && existing.quantity > 1) {
                    return prev.map(p => p.id === productId ? { ...p, quantity: p.quantity - 1 } : p);
                }
                return prev;
            });
        };

        // Global Remove/Clear
        window.removeFromCart = (productId) => {
            setCart(prev => prev.filter(p => p.id !== productId));
        };
        window.clearCart = () => setCart([]);
        window.getCart = () => cart;

    }, [cart]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-light)]">
                <div className="text-2xl font-bold text-[var(--primary)] flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري التحميل...</span>
                </div>
            </div>
        );
    }

    // Calculate Cart Count
    const cartItems = Array.isArray(cart) ? cart : [];
    const cartCount = cartItems.reduce((acc, item) => {
        if (!item) return acc;
        return acc + (item.quantity || 1);
    }, 0);

    return (
        <HashRouter>
            <ScrollToTop />

            {/* Cart Drawer - Global Overlay */}
            {window.CartSidebar && <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} lastAddedId={lastAddedId} />}

            <Layout cartCount={cartCount}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/categories" element={<CategoriesPageWrapper />} />
                    <Route path="/contact" element={<ContactPageWrapper />} />
                    <Route path="/checkout" element={<CheckoutWrapper cart={cart} />} />
                    <Route path="/amelhadj" element={<AdminPageWrapper />} />
                    <Route path="/category/:id" element={<CategoryPageWrapper />} />
                    <Route path="/product/:id" element={<ProductPageWrapper />} />
                </Routes>
            </Layout>
        </HashRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);