function CartSidebar({ isOpen, onClose, cart = [] }) {
    const { Link } = ReactRouterDOM;

    const total = cart.reduce((acc, item) => {
        if (!item) return acc;
        const price = parseInt(String(item.price || "0").replace(/[^0-9]/g, '') || 0);
        return acc + (price * (item.quantity || 1));
    }, 0);

    // Close on escape key
    React.useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            window.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-start">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Slider Panel - Right side (Flex start in RTL) */}
            <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 shadow-sm z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--text-dark)]">
                        <span className="icon-shopping-cart text-[var(--primary)] text-2xl"></span>
                        سلة المشتريات ({cart.length})
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <div className="icon-x text-2xl"></div>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 pb-20">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <span className="icon-shopping-cart text-5xl opacity-30"></span>
                            </div>
                            <p className="font-bold text-lg mb-4 text-gray-500">السلة فارغة</p>
                            <button
                                onClick={onClose}
                                className="bg-white border border-[var(--primary)] text-[var(--primary)] px-6 py-2 rounded-full font-bold hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
                            >
                                تصفح المنتجات
                            </button>
                        </div>
                    ) : (
                        cart.map((item, idx) => {
                            if (!item) return null;
                            return (
                                <div key={idx} className="flex gap-3 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="w-20 h-24 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 relative">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow min-w-0 flex flex-col justify-between h-20 py-1">
                                        <h3 className="font-bold text-sm text-[var(--text-dark)] line-clamp-2 leading-tight">{item.title}</h3>

                                        <div className="flex justify-between items-end mt-2">
                                            <p className="text-[var(--primary)] font-bold text-base">{item.price}</p>
                                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-bold">x{item.quantity || 1}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => window.removeFromCart && window.removeFromCart(item.id)}
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors self-center"
                                        title="حذف"
                                    >
                                        <div className="icon-trash-2 text-xl"></div>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="p-4 border-t bg-white shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-10">
                        <div className="flex justify-between items-center mb-4 text-xl font-bold text-[var(--text-dark)]">
                            <span>المجموع:</span>
                            <span>{total.toLocaleString()} د.ج</span>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                to="/checkout"
                                onClick={onClose}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <span>إتمام الطلب</span>
                                <span className="icon-arrow-left"></span>
                            </Link>
                            <button
                                onClick={() => {
                                    if (confirm('هل أنت متأكد من إفراغ السلة؟')) {
                                        window.clearCart && window.clearCart();
                                    }
                                }}
                                className="px-4 py-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors"
                            >
                                <span className="icon-trash-2 text-xl"></span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
