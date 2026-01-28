function CategoryPage() {
    const { useParams, Link } = ReactRouterDOM;
    const { id } = useParams();

    const [loading, setLoading] = React.useState(true);
    const [products, setProducts] = React.useState([]);
    const [categoryName, setCategoryName] = React.useState("المنتجات");

    // Fetch products from Firestore based on category
    React.useEffect(() => {
        const fetchCategoryProducts = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch category name
                const categories = window.categories || [];
                const category = categories.find(c => c.id === id);
                setCategoryName(category?.name || id);

                // Fetch all products from Firestore
                const allProducts = await window.db.getCollection('products');

                console.log(`[CategoryPage] Category ID: "${id}"`);
                console.log(`[CategoryPage] Total products fetched: ${allProducts.length}`);

                // Log first few products to see their structure
                if (allProducts.length > 0) {
                    console.log('[CategoryPage] Sample product:', allProducts[0]);
                    console.log('[CategoryPage] All product categories:', allProducts.map(p => `"${p.category}"`).join(', '));
                }

                // Filter products by category
                const filteredProducts = allProducts.filter(p => {
                    const matches = p.category === id;
                    if (!matches && allProducts.length < 20) {
                        console.log(`[CategoryPage] Product "${p.title}" has category "${p.category}", looking for "${id}"`);
                    }
                    return matches;
                });

                console.log(`[CategoryPage] Found ${filteredProducts.length} products matching category "${id}"`);

                setProducts(filteredProducts);
            } catch (error) {
                console.error('Error fetching category products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-[var(--primary)]">الرئيسية</Link>
                <span>/</span>
                <span className="font-bold text-[var(--text-dark)]">{categoryName}</span>
            </div>

            <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-8 text-center bg-[var(--bg-card)] py-4 rounded-xl">
                {categoryName}
            </h1>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <div className="icon-search text-4xl text-gray-300 mb-4 inline-block"></div>
                    <p className="text-xl text-gray-500">لا توجد منتجات في هذا القسم حالياً</p>
                    <Link to="/" className="mt-4 inline-block text-[var(--primary)] hover:underline">
                        تصفح جميع المنتجات
                    </Link>
                </div>
            )}
        </div>
    );
}
