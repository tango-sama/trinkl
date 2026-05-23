function CategorySlider() {
    const categories = window.categories || [];
    const { Link } = ReactRouterDOM;
    const scrollRef = React.useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-12 px-4">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <span className="text-sm text-[var(--primary)] font-bold mb-1 block">تصفحي سريعاً</span>
                        <h2 className="text-2xl font-bold text-[var(--text-dark)]">التصنيفات</h2>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full bg-white border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all shadow-sm"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                        <button 
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full bg-white border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all shadow-sm"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                    </div>
                </div>

                <div 
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/category/${category.id}`}
                            className="flex-shrink-0 group relative w-40 h-40 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h3 className="font-bold text-white text-sm text-center">{category.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}