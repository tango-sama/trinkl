function CategoryPage() {
    const { useParams, Link } = ReactRouterDOM;
    const { id } = useParams();

    // Find category name
    const categoryName = window.categories?.find(c => c.id === id)?.name || "المنتجات";

    // Filter products
    const displayProducts = id
        ? window.products.filter(p => p.category === id)
        : window.products;

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

            {displayProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayProducts.map(product => (
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
