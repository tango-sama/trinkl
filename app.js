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

function App() {
    const { HashRouter, Routes, Route } = ReactRouterDOM;

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const initializeData = async () => {
            try {
                // Fetch Categories
                let dbCategories = await window.db.getCollection('categories');
                if (dbCategories.length === 0 && window.categories && window.categories.length > 0) {

                    // Seed categories
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

                    // Seed products
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

                // Force Update specific views if needed, but since we modify window objects before initial render completes or strict mode, we might need to trigger re-render
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

    // Cart State
    const [cart, setCart] = React.useState([]);

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
            setCart(prev => {
                const existing = prev.find(p => p.id === product.id);
                if (existing) {
                    return prev.map(p => p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p);
                }
                return [...prev, { ...product, quantity: 1 }];
            });
            // Simple Feedback (Custom Toast would be better but alert is reliable)
            // Using a non-blocking toast would be ideal, but for now:
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-xl z-50 animate-bounce';
            notification.textContent = '✅ تم إضافة المنتج للسلة';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 2000);
        };

        // Global Remove/Clear
        window.removeFromCart = (productId) => {
            setCart(prev => prev.filter(p => p.id !== productId));
        };
        window.clearCart = () => setCart([]);
        window.getCart = () => cart;

    }, [cart]);

    // Wrapper for the main layout to include Header and Footer on all pages
    const Layout = ({ children }) => {
        const location = ReactRouterDOM.useLocation();
        const isAdmin = location.pathname.startsWith('/amelhadj');
        // Safeguard: Ensure cart is array before reduce, and handle potential null items
        const cartItems = Array.isArray(cart) ? cart : [];
        const cartCount = cartItems.reduce((acc, item) => {
            if (!item) return acc;
            return acc + (item.quantity || 1);
        }, 0);

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

    // Placeholder components until valid ones are created
    const CategoryPageComponent = () => window.CategoryPage ? <CategoryPage /> : <div className="p-10 text-center">جاري تحميل صفحة التصنيف...</div>;
    const CategoriesPageComponent = () => window.CategoriesPage ? <CategoriesPage /> : <div className="p-10 text-center">جاري تحميل صفحة التصنيفات...</div>;
    const ProductPageComponent = () => window.ProductPage ? <ProductPage /> : <div className="p-10 text-center">جاري تحميل صفحة المنتج...</div>;
    const ContactPageComponent = () => window.ContactPage ? <ContactPage /> : <div className="p-10 text-center">جاري تحميل صفحة اتصل بنا...</div>;
    const CheckoutPageComponent = () => window.CheckoutPage ? <CheckoutPage cart={cart} /> : <div className="p-10 text-center">جاري تحميل صفحة الدفع...</div>;
    const AdminPageComponent = () => window.AdminPage ? <AdminPage /> : <div className="p-10 text-center">جاري تحميل لوحة التحكم...</div>;

    // Helper for reset scroll
    const ScrollToTop = () => {
        const { pathname } = ReactRouterDOM.useLocation();
        React.useEffect(() => {
            window.scrollTo(0, 0);
        }, [pathname]);
        return null;
    };

    return (
        <HashRouter>
            <ScrollToTop />
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/categories" element={<CategoriesPageComponent />} />
                    <Route path="/contact" element={<ContactPageComponent />} />
                    <Route path="/checkout" element={<CheckoutPageComponent />} />
                    <Route path="/amelhadj" element={<AdminPageComponent />} />
                    <Route path="/category/:id" element={<CategoryPageComponent />} />
                    <Route path="/product/:id" element={<ProductPageComponent />} />
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