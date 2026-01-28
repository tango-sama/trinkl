function AllProductsPage() {
    const { Link } = ReactRouterDOM;
    const [currentPage, setCurrentPage] = React.useState(1);
    const productsPerPage = 20;

    const allProducts = window.products || [];

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(p => p + 1);
        window.scrollTo(0, 0);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(p => p - 1);
        window.scrollTo(0, 0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-[var(--primary)]">الرئيسية</Link>
                <span>/</span>
                <span className="font-bold text-[var(--text-dark)]">جميع المنتجات</span>
            </div>

            <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-8 text-center bg-[var(--bg-card)] py-4 rounded-xl">
                جميع المنتجات ({allProducts.length})
            </h1>

            {currentProducts.length > 0 ? (
                <React.Fragment>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center gap-4">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className={`px-6 py-2 rounded-lg font-bold transition-colors ${currentPage === 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-[var(--primary)] text-white hover:bg-[var(--accent)]'
                                    }`}
                            >
                                السابق
                            </button>

                            <span className="flex items-center px-4 font-bold text-gray-600">
                                صفحة {currentPage} من {totalPages}
                            </span>

                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className={`px-6 py-2 rounded-lg font-bold transition-colors ${currentPage === totalPages
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-[var(--primary)] text-white hover:bg-[var(--accent)]'
                                    }`}
                            >
                                التالي
                            </button>
                        </div>
                    )}
                </React.Fragment>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <div className="icon-search text-4xl text-gray-300 mb-4 inline-block"></div>
                    <p className="text-xl text-gray-500">لا توجد منتجات حالياً</p>
                </div>
            )}
        </div>
    );
}
