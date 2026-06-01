function CartSidebar({ isOpen, onClose, cart, lastAddedId }) {
    const calculateTotal = () => {
        const items = Array.isArray(cart) ? cart : [];
        return items.reduce((acc, item) => {
            if (!item) return acc;
            const priceStr = String(item.price || "0");
            const price = parseInt(priceStr.replace(/[^0-9]/g, '') || 0);
            return acc + (price * (item.quantity || 1));
        }, 0);
    };

    const totalItems = Array.isArray(cart) ? cart.reduce((acc, item) => acc + (item?.quantity || 1), 0) : 0;

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onClose}
            ></div>
            
            {/* Sidebar */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-[var(--border-color)] shadow-2xl z-50 flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-dark)]">سلة المشتريات</h2>
                            <p className="text-sm text-[var(--text-muted)]">{totalItems} منتج</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-[var(--bg-light)] flex items-center justify-center hover:bg-[var(--primary)]/10 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!cart || cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-24 h-24 bg-[var(--bg-light)] rounded-full flex items-center justify-center mb-4">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                            </div>
                            <p className="text-[var(--text-muted)] font-bold text-lg">السلة فارغة</p>
                            <p className="text-sm text-[var(--text-muted)] mt-2">أضفي بعض المنتجات!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item, idx) => {
                                if (!item) return null;
                                const isLastAdded = item.id === lastAddedId;
                                return (
                                    <div 
                                        key={idx} 
                                        className={`flex gap-4 items-center bg-[var(--bg-light)] rounded-xl p-4 transition-all ${isLastAdded ? 'ring-2 ring-[var(--primary)] animate-pulse' : ''}`}
                                    >
                                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-[var(--border-color)] flex-shrink-0 bg-white">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h3 className="font-bold text-sm text-[var(--text-dark)] line-clamp-1">{item.title}</h3>
                                            <p className="text-[var(--primary)] font-bold text-sm mt-1">{item.price}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => window.decreaseQuantity && window.decreaseQuantity(item.id)}
                                                    className={`w-7 h-7 bg-white border border-[var(--border-color)] rounded-lg hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all flex items-center justify-center text-[var(--primary)] ${(!item.quantity || item.quantity <= 1) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={!item.quantity || item.quantity <= 1}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
                                                </button>
                                                <span className="font-bold text-sm w-6 text-center">{item.quantity || 1}</span>
                                                <button
                                                    onClick={() => window.addToCart && window.addToCart(item)}
                                                    className="w-7 h-7 bg-white border border-[var(--border-color)] rounded-lg hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all flex items-center justify-center text-[var(--primary)]"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => window.removeFromCart && window.removeFromCart(item.id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart && cart.length > 0 && (
                    <div className="border-t border-[var(--border-color)] p-6 space-y-4">
                        <div className="flex justify-between items-center text-xl font-extrabold text-[var(--text-dark)]">
                            <span>المجموع:</span>
                            <span className="text-[var(--primary)]">{calculateTotal().toLocaleString()} د.ج</span>
                        </div>
                        <ReactRouterDOM.Link
                            to="/checkout"
                            onClick={onClose}
                            className="btn-primary w-full text-center block text-lg py-4"
                        >
                            إتمام الطلب
                        </ReactRouterDOM.Link>
                        <button 
                            onClick={onClose}
                            className="w-full text-center text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors text-sm"
                        >
                            مواصلة التسوق
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}