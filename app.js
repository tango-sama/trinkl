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
    const { useLocation, useNavigate } = ReactRouterDOM;
    const location = useLocation();
    const navigate = useNavigate();
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

// ... (Rest of component definitions)
// RESTORING DELETED COMPONENTS
const HomePage = () => (
    <React.Fragment>
        <Hero />
        <CategorySlider />
        <ProductCarousel />
        <ProductGrid />
        <Features />
    </React.Fragment>
);

const CheckoutWrapper = ({ cart }) => window.CheckoutPage ? <CheckoutPage cart={cart} /> : <div className="p-10 text-center">جاري تحميل صفحة الدفع...</div>;
const CategoryPageWrapper = () => window.CategoryPage ? <CategoryPage /> : <div className="p-10 text-center">جاري تحميل صفحة التصنيف...</div>;
const CategoriesPageWrapper = () => window.CategoriesPage ? <CategoriesPage /> : <div className="p-10 text-center">جاري تحميل صفحة التصنيفات...</div>;
const ProductPageWrapper = () => window.ProductPage ? <ProductPage /> : <div className="p-10 text-center">جاري تحميل صفحة المنتج...</div>;
const ContactPageWrapper = () => window.ContactPage ? <ContactPage /> : <div className="p-10 text-center">جاري تحميل صفحة اتصل بنا...</div>;
const AllProductsPageWrapper = () => window.AllProductsPage ? <AllProductsPage /> : <div className="p-10 text-center">جاري تحميل المنتجات...</div>;
const AdminPageWrapper = () => window.AdminPage ? <AdminPage /> : <div className="p-10 text-center">جاري تحميل لوحة التحكم...</div>;

const ScrollToTop = () => {
    const { pathname } = ReactRouterDOM.useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    const { HashRouter, Routes, Route } = ReactRouterDOM; // Switched to HashRouter

    const [loading, setLoading] = React.useState(true);

    // Cart State
    const [cart, setCart] = React.useState([]);
    // Cart Drawer State
    const [isCartOpen, setIsCartOpen] = React.useState(false);
    const [lastAddedId, setLastAddedId] = React.useState(null);

    React.useEffect(() => {
        const initializeData = async () => {
            try {
                console.log('[App] Starting data initialization...');
                const startTime = Date.now();

                // Only fetch categories and settings on initial load
                // Products will be fetched on-demand by individual pages
                const [dbCategories, settingsDocs] = await Promise.all([
                    window.db.getCollection('categories'),
                    window.db.getCollection('site_settings').catch(() => [])
                ]);

                console.log(`[App] Fetched ${dbCategories.length} categories in ${Date.now() - startTime}ms`);

                // Handle Categories
                if (dbCategories.length === 0 && window.categories && window.categories.length > 0) {
                    for (const cat of window.categories) {
                        await window.db.addDocument('categories', cat);
                    }
                    window.categories = window.categories;
                } else if (dbCategories.length > 0) {
                    // Sort categories by sortOrder
                    window.categories = dbCategories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
                }

                // Products are now fetched on-demand by individual pages (not on app init)

                // Handle Settings
                if (settingsDocs && settingsDocs.length > 0) {
                    window.siteSettings = settingsDocs[0];
                } else {
                    window.siteSettings = {};
                }

                console.log(`[App] Initialization complete in ${Date.now() - startTime}ms`);
                setLoading(false);
            } catch (error) {
                console.error("Failed to initialize data:", error);
                setLoading(false);
            }
        };

        if (window.db) {
            // Add timeout - don't wait forever
            const timeout = setTimeout(() => {
                console.warn('[App] Data loading timeout - proceeding anyway');
                setLoading(false);
            }, 10000); // 10 second timeout

            initializeData().then(() => clearTimeout(timeout));
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
                    <Route path="/products" element={<AllProductsPageWrapper />} />
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