function ProductCard({ product }) {
    const { Link } = ReactRouterDOM;

    return (
        <div className="bg-[var(--bg-light)] rounded-xl overflow-hidden shadow-lg border border-[var(--secondary)] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full relative group">
            {/* Decorative top-right corner element (mimicking the design's "shine" or tag) */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--secondary)] to-transparent opacity-50 z-10 rounded-bl-3xl pointer-events-none"></div>

            <Link to={`/product/${product.id}`} className="h-48 overflow-hidden relative bg-white p-4 flex items-center justify-center block">
                <img
                    src={product.image}
                    alt={product.title}
                    className="h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
            </Link>

            <div className="p-4 flex flex-col flex-grow text-center bg-[var(--bg-card)]/50">
                <Link to={`/product/${product.id}`} className="hover:text-[var(--primary)] transition-colors">
                    <h3 className="font-bold text-[var(--text-dark)] mb-2 line-clamp-1">{product.title}</h3>
                </Link>
                <p className="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {product.subtitle}
                </p>

                <div className="mt-auto flex flex-col gap-2">
                    <Link to={`/product/${product.id}`} className="w-full bg-[var(--primary)] hover:bg-[var(--accent)] text-white font-bold py-2 px-4 rounded shadow transition-colors flex items-center justify-center gap-2">
                        <span>إضافة للسلة</span>
                        <div className="icon-shopping-cart text-lg"></div>
                    </Link>
                    <a
                        href={`https://wa.me/213664925052?text=${encodeURIComponent(`مرحباً، أريد طلب المنتج: ${product.title}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow transition-colors flex items-center justify-center gap-2"
                    >
                        <span>اطلب عبر واتساب</span>
                        <div className="icon-message-circle text-lg"></div>
                    </a>
                </div>
            </div>
        </div>
    );
}