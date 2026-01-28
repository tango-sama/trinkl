const CategorySlider = () => {
    const { Link } = ReactRouterDOM;
    const categories = window.categories || [];

    if (categories.length === 0) return null;

    return (
        <section className="py-8 bg-white border-b border-[var(--secondary)]/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-dark)] flex items-center gap-2">
                        <span className="w-1 h-6 bg-[var(--primary)] rounded-full"></span>
                        تسوق حسب القسم
                    </h2>
                    <Link to="/categories" className="text-[var(--primary)] text-sm font-bold flex items-center gap-1 hover:underline">
                        عرض الكل
                        <div className="icon-arrow-left text-xs"></div>
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar scroll-smooth">
                    {categories.map(cat => (
                        <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            className="flex-shrink-0 w-24 md:w-28 flex flex-col items-center gap-3 group snap-start"
                        >
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-100 p-1 group-hover:border-[var(--primary)] transition-all duration-300 overflow-hidden bg-white shadow-sm ring-1 ring-gray-50">
                                <img
                                    src={cat.image || './assets/placeholder.png'}
                                    alt={cat.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4=';
                                    }}
                                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <span className="text-xs md:text-sm font-bold text-[var(--text-dark)] text-center group-hover:text-[var(--primary)] transition-colors line-clamp-2 leading-tight">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};
