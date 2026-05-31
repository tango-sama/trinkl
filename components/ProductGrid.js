function ProductGrid() {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const { Link } = ReactRouterDOM;

    React.useEffect(() => {
        const loadProducts = async () => {
            try {
                // Try to get from Firestore first
                if (window.db) {
                    const dbProducts = await window.db.getCollection('products');
                    if (dbProducts && dbProducts.length > 0) {
                        setProducts(dbProducts.slice(0, 8));
                        setLoading(false);
                        return;
                    }
                }
                // Fallback to static data
                if (window.products && window.products.length > 0) {
                    setProducts(window.products.slice(0, 8));
                }
            } catch (error) {
                console.error('Error loading products:', error);
                if (window.products) {
                    setProducts(window.products.slice(0, 8));
                }
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-32 h-8 bg-[var(--bg-beige)] rounded-full mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {[1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="bg-white rounded-2xl h-[420px] animate-pulse">
                                <div className="h-64 bg-[var(--bg-beige)] rounded-t-2xl"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-[var(--bg-beige)] rounded w-3/4"></div>
                                    <div className="h-4 bg-[var(--bg-beige)] rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 bg-gradient-to-b from-transparent via-[var(--bg-beige)]/30 to-transparent">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <span className="section-label">منتجاتنا المميزة</span>
                    <h2 className="section-title">أحدث المنتجات</h2>
                    <div className="gold-underline"></div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link 
                        to="/products" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[var(--primary)] text-[var(--primary)] rounded-xl font-bold hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                        <span>عرض جميع المنتجات</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}