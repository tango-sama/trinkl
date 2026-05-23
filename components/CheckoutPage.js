function CheckoutPage({ cart = [] }) {
    const [formData, setFormData] = React.useState({
        name: '',
        phone: '',
        wilaya: '',
        baladiya: '',
        deliveryType: 'home'
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);

    const wilayas = window.wilayas || [
        "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار", "البليدة", "البويرة",
        "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة",
        "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة", "وهران"
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        const items = Array.isArray(cart) ? cart : [];
        return items.reduce((acc, item) => {
            if (!item) return acc;
            const priceStr = String(item.price || "0");
            const price = parseInt(priceStr.replace(/[^0-9]/g, '') || 0);
            return acc + (price * (item.quantity || 1));
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const total = calculateTotal();
        const validItems = Array.isArray(cart) ? cart.filter(Boolean) : [];

        const message = `
*طلب جديد من Desert Shop* 🌵
---------------------------
🛒 *المنتجات:*
${validItems.map(item => `- ${item.title} (عدد: ${item.quantity || 1})`).join('\n')}

💰 *المجموع:* ${total.toLocaleString()} د.ج
---------------------------
👤 الاسم: ${formData.name}
📱 الهاتف: ${formData.phone}
📍 العنوان: ${formData.wilaya} - ${formData.baladiya}
🚚 التوصيل: ${formData.deliveryType === 'home' ? 'للمنزل' : 'للمكتب (Stop Desk)'}
---------------------------
يرجى تأكيد الطلب.
        `.trim();

        const whatsappUrl = `https://wa.me/213662705830?text=${encodeURIComponent(message)}`;
        
        // Show success animation
        setShowSuccess(true);
        
        // Clear cart after delay
        setTimeout(() => {
            if (window.clearCart) window.clearCart();
            window.open(whatsappUrl, '_blank');
            setShowSuccess(false);
            setIsSubmitting(false);
        }, 1500);
    };

    // Empty cart state
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-28 h-28 bg-gradient-to-br from-[var(--bg-beige)] to-[var(--bg-light)] rounded-full flex items-center justify-center mb-8 shadow-inner">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                </div>
                <h2 className="text-3xl font-bold text-[var(--text-dark)] mb-4">سلة المشتريات فارغة</h2>
                <p className="text-[var(--text-muted)] mb-8 max-w-md text-lg">لم تقم بإضافة أي منتجات للسلة بعد. تصفح منتجاتنا واختر ما يناسبك.</p>
                <ReactRouterDOM.Link to="/" className="btn-primary text-lg px-8 py-4">
                    تصفح المنتجات
                </ReactRouterDOM.Link>
            </div>
        );
    }

    // Success overlay
    if (showSuccess) {
        return (
            <div className="container mx-auto px-4 py-20 min-h-[60vh] flex items-center justify-center">
                <div className="text-center animate-scale-in">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--text-dark)] mb-4">تم إرسال طلبك!</h2>
                    <p className="text-[var(--text-muted)] text-lg">جاري تحويلك إلى واتساب...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-center text-[var(--text-dark)] mb-2">إتمام الطلب</h1>
            <p className="text-center text-[var(--text-muted)] mb-8">أكملي بياناتك وسنقوم بالتواصل معك لتأكيد الطلب</p>

            <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto">
                {/* Cart Summary */}
                <div className="w-full lg:w-1/3 order-1 lg:order-2">
                    <div className="bg-white rounded-2xl shadow-lg border border-[var(--border-color)] p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-[var(--border-color)] pb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                            ملخص الطلب ({cart.length})
                        </h2>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar mb-6">
                            {cart.map((item, idx) => {
                                if (!item) return null;
                                return (
                                    <div key={idx || item.id} className="flex gap-4 items-center border-b border-[var(--border-color)] pb-4 last:border-0">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[var(--border-color)] flex-shrink-0 bg-[var(--bg-light)]">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h3 className="font-bold text-sm text-[var(--text-dark)] line-clamp-1">{item.title}</h3>
                                            <p className="text-[var(--primary)] font-bold text-sm">{item.price}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => window.addToCart && window.addToCart(item)}
                                                    className="w-8 h-8 bg-[var(--bg-light)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all flex items-center justify-center text-[var(--primary)]"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                                </button>
                                                <span className="font-bold text-base w-6 text-center">{item.quantity || 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => window.decreaseQuantity && window.decreaseQuantity(item.id)}
                                                    className={`w-8 h-8 bg-[var(--bg-light)] border border-[var(--border-color)] rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center ${(!item.quantity || item.quantity <= 1) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={!item.quantity || item.quantity <= 1}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => window.removeFromCart && window.removeFromCart(item.id)}
                                            className="text-red-500 bg-red-50 hover:bg-red-100 p-2 rounded-xl transition-colors flex-shrink-0"
                                            title="حذف من السلة"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="pt-4 border-t-2 border-dashed border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-light)] to-transparent -mx-6 -mb-6 p-6 rounded-b-2xl">
                            <div className="flex justify-between items-center text-xl font-extrabold text-[var(--text-dark)]">
                                <span>المجموع الكلي:</span>
                                <span className="text-[var(--primary)]">{calculateTotal().toLocaleString()} د.ج</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="w-full lg:w-2/3 order-2 lg:order-1">
                    <div className="bg-white rounded-2xl shadow-xl border border-[var(--border-color)] overflow-hidden">
                        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] py-4 px-6 text-white text-center font-bold">
                            <p className="flex items-center justify-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                الدفع عند الاستلام - Cash on Delivery
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[var(--text-dark)] font-bold mb-2">الاسم الكامل</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all bg-[var(--bg-light)]"
                                        placeholder="الاسم واللقب"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[var(--text-dark)] font-bold mb-2">رقم الهاتف</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        pattern="[0-9]{10}"
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all bg-[var(--bg-light)] text-left ltr"
                                        placeholder="05/06/07..."
                                        dir="ltr"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[var(--text-dark)] font-bold mb-2">الولاية</label>
                                    <select
                                        name="wilaya"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all bg-[var(--bg-light)]"
                                        onChange={handleChange}
                                    >
                                        <option value="">اختر الولاية</option>
                                        {wilayas.map((w, i) => (
                                            <option key={i} value={w}>{i + 1} - {w}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[var(--text-dark)] font-bold mb-2">البلدية</label>
                                    <input
                                        type="text"
                                        name="baladiya"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all bg-[var(--bg-light)]"
                                        placeholder="اسم البلدية"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[var(--text-dark)] font-bold mb-3">نوع التوصيل</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${formData.deliveryType === 'home' ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border-color)] hover:border-[var(--primary)]/50'}`}>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.deliveryType === 'home' ? 'border-[var(--primary)]' : 'border-[var(--border-color)]'}`}>
                                            {formData.deliveryType === 'home' && <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <input type="radio" name="deliveryType" value="home" defaultChecked onChange={handleChange} className="hidden" />
                                        <div>
                                            <span className="font-bold block">توصيل للمنزل</span>
                                            <span className="text-sm text-[var(--text-muted)]">التوصيل مباشرة لباب منزلك</span>
                                        </div>
                                    </label>
                                    <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${formData.deliveryType === 'office' ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border-color)] hover:border-[var(--primary)]/50'}`}>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.deliveryType === 'office' ? 'border-[var(--primary)]' : 'border-[var(--border-color)]'}`}>
                                            {formData.deliveryType === 'office' && <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <input type="radio" name="deliveryType" value="office" onChange={handleChange} className="hidden" />
                                        <div>
                                            <span className="font-bold block">توصيل للمكتب</span>
                                            <span className="text-sm text-[var(--text-muted)]">استلام من مكتب التوصيل (Stop Desk)</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 text-xl flex justify-center items-center gap-3 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>جاري الإرسال...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>تأكيد الطلب عبر واتساب</span>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-[var(--text-muted)] mt-4 leading-relaxed bg-[var(--bg-light)] p-4 rounded-xl">
                                عند الضغط على الزر، سيتم فتح تطبيق واتساب مع تفاصيل طلبك جاهزة للإرسال.
                                <br />سيقوم فريقنا بتأكيد الطلب معك وشحنه في أقرب وقت.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}