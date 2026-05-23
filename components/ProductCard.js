function ProductCard({ product }) {
    const { Link, useNavigate } = ReactRouterDOM;
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    // Format price with proper display
    const formatPrice = (price) => {
        if (!price) return '0 DA';
        const priceStr = String(price);
        const numericPrice = priceStr.replace(/[^0-9]/g, '');
        return `${parseInt(numericPrice).toLocaleString('fr-DZ')} DA`;
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-[var(--border-color)] h-[420px]"
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[var(--bg-beige)] to-[var(--bg-light)]">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Category badge */}
                {product.category && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--primary)] shadow-sm">
                        {window.categories?.find(c => c.id === product.category)?.name || product.category}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col h-[156px]">
                <h3 className="font-bold text-[var(--text-dark)] text-base mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                    {product.title}
                </h3>
                
                {product.subtitle && (
                    <p className="text-[var(--text-muted)] text-sm mb-3 line-clamp-1">
                        {product.subtitle}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-[var(--primary)]">
                        {formatPrice(product.price)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                        {/* WhatsApp button */}
                        <a
                            href={`https://wa.me/213662705830?text=${encodeURIComponent(`مرحباً، أريد طلب المنتج: ${product.title}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all shadow-md"
                            title="اطلب عبر واتساب"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                        </a>
                        
                        {/* Add to cart button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (window.addToCart) window.addToCart(product);
                            }}
                            className="w-10 h-10 bg-[var(--primary)] text-white rounded-xl flex items-center justify-center hover:bg-[var(--primary-dark)] hover:scale-110 transition-all shadow-md"
                            title="إضافة للسلة"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}