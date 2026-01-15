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

            {/* Dark Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10 transition-opacity duration-300 opacity-90 group-hover:opacity-100"></div>

            {/* Decorative Shine */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/20 to-transparent z-10 rounded-bl-full pointer-events-none"></div>

            {/* Content Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex flex-col justify-end h-full">

                {/* Blurred Title Container */}
                <div className="mt-auto mb-4 backdrop-blur-md bg-white/10 border border-white/20 p-3 rounded-xl shadow-lg hover:bg-white/20 transition-colors">
                    <Link to={`/product/${product.id}`} className="block text-center">
                        <h3 className="font-bold text-white text-lg tracking-wide drop-shadow-md line-clamp-2">
                            {product.title}
                        </h3>
                    </Link>
                </div>

                {/* Buttons Container */}
                <div className="flex flex-col gap-2 transform translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Link
                        to={`/product/${product.id}`}
                        className="w-full bg-[var(--primary)]/20 hover:bg-[var(--primary)]/40 text-white font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 text-sm transition-all border border-white/20 backdrop-blur-md"
                    >
                        <span>إضافة للسلة</span>
                        <div className="icon-shopping-cart text-lg"></div>
                    </Link>
                    <a
                        href={`https://wa.me/213664925052?text=${encodeURIComponent(`مرحباً، أريد طلب المنتج: ${product.title}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-green-500/20 hover:bg-green-500/40 text-white font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 text-sm transition-all border border-white/20 backdrop-blur-md"
                    >
                        <span>اطلب عبر واتساب</span>
                        <div className="icon-message-circle text-lg"></div>
                    </a>
                </div>
            </div>
        </div>
    );
}