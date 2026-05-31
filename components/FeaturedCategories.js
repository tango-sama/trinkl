function FeaturedCategories() {
    const categories = window.categories || [];
    const { Link } = ReactRouterDOM;

    return (
        <section className="py-16 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <span className="section-label">تسوقي حسب الفئة</span>
                    <h2 className="section-title">تصنيفاتنا</h2>
                    <div className="gold-underline"></div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            to={`/category/${category.id}`}
                            className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-2xl transition-all duration-500 border border-[var(--border-color)]"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500"></div>
                            
                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <h3 className="font-bold text-white text-lg mb-1 group-hover:translate-y-0 transition-transform">
                                    {category.name}
                                </h3>
                                <div className="flex items-center gap-2 text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    <span>تصفحي المنتجات</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                </div>
                            </div>

                            {/* Hover border effect */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)] rounded-2xl transition-all duration-500"></div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}