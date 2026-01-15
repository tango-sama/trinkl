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

    // Wrapper for the main layout to include Header and Footer on all pages
    const Layout = ({ children }) => {
        const location = ReactRouterDOM.useLocation();
        const isAdmin = location.pathname.startsWith('/amelhadj');

        return (
            <div className="min-h-screen flex flex-col">
                <Header />
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
    const CheckoutPageComponent = () => window.CheckoutPage ? <CheckoutPage /> : <div className="p-10 text-center">جاري تحميل صفحة الدفع...</div>;
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