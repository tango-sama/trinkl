function ProductCard({ product }) {
    const { Link } = ReactRouterDOM;

    return (
        <div className="relative rounded-2xl overflow-hidden shadow-lg h-96 group border border-white/20 hover:shadow-2xl transition-all duration-500">
            {/* Background Image - Full Cover */}
            <div className="absolute inset-0 bg-gray-100">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-10 opacity-70 group-hover:opacity-90 transition-opacity"></div>

            {/* Top Title */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20">
                <div className="backdrop-blur-md bg-white/10 border border-white/10 p-2 rounded-lg text-center shadow-lg">
                    <Link to={`/product/${product.id}`} className="block">
                        <h3 className="font-bold text-white text-xs md:text-sm drop-shadow-md line-clamp-2 hover:text-[var(--primary-light)] transition-colors">
                            {product.title}
                        </h3>
                    </Link>
                </div>
            </div>

            {/* Buttons - Bottom Corners */}
            {/* WhatsApp - Bottom Right */}
            <div className="absolute bottom-4 right-4 z-30">
                <a
                    href={`https://wa.me/213664925052?text=${encodeURIComponent(`مرحباً، أريد طلب المنتج: ${product.title}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 bg-green-500/20 hover:bg-green-500/60 text-white rounded-xl shadow-lg flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 hover:rotate-3"
                    title="اطلب عبر واتساب"
                >
                    <div className="icon-message-circle text-2xl"></div>
                </a>
            </div>

            {/* Add to Cart - Bottom Left */}
            <div className="absolute bottom-4 left-4 z-30">
                <Link
                    to={`/product/${product.id}`}
                    className="w-12 h-12 bg-[var(--primary)]/20 hover:bg-[var(--primary)]/60 text-white rounded-xl shadow-lg flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 hover:-rotate-3"
                    title="إضافة للسلة"
                >
                    <div className="icon-shopping-cart text-2xl"></div>
                </Link>
            </div>
        </div>
    );
}