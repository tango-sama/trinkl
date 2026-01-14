function ProductPage() {
    const { useParams, Link } = ReactRouterDOM;
    const { id } = useParams();
    const product = window.products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="text-2xl font-bold text-gray-600">عذراً، المنتج غير موجود</div>
                <Link to="/" className="mt-4 block text-[var(--primary)] hover:underline">العودة للرئيسية</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-[var(--primary)]">الرئيسية</Link>
                <span>/</span>
                {product.category && (
                    <>
                        <Link to={`/category/${product.category}`} className="hover:text-[var(--primary)]">
                            {window.categories?.find(c => c.id === product.category)?.name}
                        </Link>
                        <span>/</span>
                    </>
                )}
                <span className="font-bold text-[var(--text-dark)] line-clamp-1">{product.title}</span>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[var(--bg-card)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-96 md:h-[500px] bg-gray-50 flex items-center justify-center p-8 relative overflow-hidden group">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <div className="p-8 flex flex-col justify-center bg-[var(--bg-light)]/30">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-dark)] mb-4">{product.title}</h1>
                        <div className="text-2xl font-bold text-[var(--primary)] mb-6">{product.price}</div>

                        <p className="text-lg text-gray-700 leading-relaxed mb-8">
                            {product.subtitle}
                        </p>

                        <div className="flex flex-col gap-4 mt-auto">
                            <Link to="/checkout" className="w-full bg-[var(--primary)] hover:bg-[var(--accent)] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg">
                                <span>إتمام الطلب (الدفع عند الاستلام)</span>
                                <div className="icon-truck"></div>
                            </Link>
                            <a
                                href={`https://wa.me/213664925052?text=${encodeURIComponent(`مرحباً، أريد طلب المنتج: ${product.title}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
                            >
                                <span>اطلب عبر واتساب</span>
                                <div className="icon-message-circle text-xl"></div>
                            </a>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="flex gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="icon-truck text-[var(--primary)]"></span>
                                    <span>شحن سريع</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="icon-shield text-[var(--primary)]"></span>
                                    <span>ضمان أصلي</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Placeholder */}
            {/* Can be implemented later */}
        </div>
    );
}
