function ProductGrid() {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all products
                const allProducts = await window.db.getCollection('products');
                // For "Most Sold", ideally we sort by a sales count.
                // For now, we'll just take the first 8 products or random ones.
                // Let's assume the first 8 are good candidates.
                setProducts(allProducts.slice(0, 8));
            } catch (error) {
                console.error('[ProductGrid] Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto flex justify-center">
                    <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[var(--text-dark)] inline-block relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-[var(--primary)] after:rounded-full">
                        المنتجات الرائجة
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button
                        onClick={() => window.location.hash = '/products'}
                        className="px-8 py-3 bg-white border-2 border-[var(--primary)] text-[var(--primary)] font-bold rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        عرض جميع المنتجات
                    </button>
                </div>
            </div>
        </section>
    );
}