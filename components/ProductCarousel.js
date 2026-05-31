function ProductCarousel() {
    const [featuredProducts, setFeaturedProducts] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
        const loadFeatured = async () => {
            try {
                if (window.db) {
                    const products = await window.db.getCollection('featured_products');
                    if (products && products.length > 0) {
                        setFeaturedProducts(products.sort((a, b) => (a.order || 0) - (b.order || 0)));
                        return;
                    }
                }
            } catch (error) {
                console.error('Error loading featured products:', error);
            }
        };
        loadFeatured();
    }, []);

    // Auto-advance carousel
    React.useEffect(() => {
        if (featuredProducts.length <= 1) return;
        const timer = setInterval(() => {
            goToNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [featuredProducts, currentIndex]);

    const goToNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const goToPrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    if (featuredProducts.length === 0) return null;

    const currentProduct = featuredProducts[currentIndex];

    return (
        <section className="py-16 px-4 bg-gradient-to-b from-[var(--bg-beige)]/50 to-transparent">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <span className="section-label">منتجات مميزة</span>
                    <h2 className="section-title">اكتشفي المميز</h2>
                    <div className="gold-underline"></div>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-[var(--border-color)] overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Image Side */}
                            <div className="relative h-64 md:h-auto min-h-[400px] bg-gradient-to-br from-[var(--bg-beige)] to-[var(--bg-light)]">
                                <img
                                    src={currentProduct.image}
                                    alt={currentProduct.productName}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>

                            {/* Content Side */}
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="mb-6">
                                    <span className="inline-block bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-1 rounded-full text-sm font-bold mb-4">
                                        منتج مميز
                                    </span>
                                    <h3 className="text-3xl md:text-4xl font-bold text-[var(--text-dark)] mb-4">
                                        {currentProduct.productName}
                                    </h3>
                                    
                                    {currentProduct.rightText && (
                                        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                                            {currentProduct.rightText}
                                        </p>
                                    )}
                                    
                                    {currentProduct.leftText && (
                                        <p className="text-[var(--text-muted)] leading-relaxed">
                                            {currentProduct.leftText}
                                        </p>
                                    )}
                                </div>

                                {currentProduct.ctaText && (
                                    <a
                                        href={currentProduct.productLink || '#/products'}
                                        className="btn-primary inline-flex items-center gap-2 self-start"
                                    >
                                        <span>{currentProduct.ctaText}</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    {featuredProducts.length > 1 && (
                        <>
                            <button
                                onClick={goToPrev}
                                className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all hover:scale-110 border border-[var(--border-color)]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all hover:scale-110 border border-[var(--border-color)]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                            </button>

                            {/* Dots */}
                            <div className="flex justify-center gap-2 mt-6">
                                {featuredProducts.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            if (!isAnimating) {
                                                setIsAnimating(true);
                                                setCurrentIndex(idx);
                                                setTimeout(() => setIsAnimating(false), 500);
                                            }
                                        }}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            idx === currentIndex 
                                                ? 'w-8 bg-[var(--primary)]' 
                                                : 'w-2 bg-[var(--border-color)] hover:bg-[var(--primary)]/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}