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

    // Backward Compatibility: Redirect Hash URLs to Path URLs
    React.useEffect(() => {
        if (window.location.hash && window.location.hash.startsWith('#/')) {
            const newPath = window.location.hash.substring(1);
            navigate(newPath, { replace: true });
        }
    }, [navigate]);

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
        <CategorySlider />
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
    const { BrowserRouter, Routes, Route } = ReactRouterDOM;

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
        <BrowserRouter>
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
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);