function CheckoutPage({ cart = [] }) {
    const [formData, setFormData] = React.useState({
        name: '',
        phone: '',
        wilaya: '',
        baladiya: '',
        deliveryType: 'home'
    });

    const wilayas = window.wilayas || [
        "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار", "البليدة", "البويرة",
        "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة",
        "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة", "وهران"
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        // Safeguard against missing cart or null items
        const items = Array.isArray(cart) ? cart : [];
        return items.reduce((acc, item) => {
            if (!item) return acc;
            const priceStr = String(item.price || "0");
            const price = parseInt(priceStr.replace(/[^0-9]/g, '') || 0);
            return acc + (price * (item.quantity || 1));
        }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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

        const whatsappUrl = `https://wa.me/213664925052?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Clear Cart
        if (window.clearCart) window.clearCart();
    };

    // Safeguard for UI: if cart is empty or null
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <div className="icon-shopping-cart text-4xl"></div>
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4">سلة المشتريات فارغة</h2>
                <p className="text-gray-500 mb-8 max-w-md">لم تقم بإضافة أي منتجات للسلة بعد. تصفح منتجاتنا واختر ما يناسبك.</p>
                <ReactRouterDOM.Link to="/" className="bg-[var(--primary)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                    تصفح المنتجات
                </ReactRouterDOM.Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-center text-[var(--text-dark)] mb-8">إتمام الطلب</h1>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Cart Summary Section */}
                <div className="w-full lg:w-1/3 order-1 lg:order-2">
                    <div className="bg-white rounded-2xl shadow-lg border border-[var(--primary)]/20 p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-4">
                            <span className="icon-shopping-cart text-[var(--primary)]"></span>
                            ملخص الطلب ({cart.length})
                        </h2>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar mb-6">
                            {cart.map((item, idx) => {
                                if (!item) return null;
                                return (
                                    <div key={idx || item.id} className="flex gap-4 items-center border-b border-gray-50 pb-4 last:border-0 relative group">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-sm text-[var(--text-dark)] line-clamp-1">{item.title}</h3>
                                            <p className="text-[var(--primary)] font-bold text-sm">{item.price}</p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => window.addToCart && window.addToCart(item)}
                                                    className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-colors flex items-center justify-center text-[var(--primary)]"
                                                >
                                                    <div className="icon-plus text-sm"></div>
                                                </button>
                                                <span className="font-bold text-base w-6 text-center">{item.quantity || 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => window.decreaseQuantity && window.decreaseQuantity(item.id)}
                                                    className={`w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center ${(!item.quantity || item.quantity <= 1) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={!item.quantity || item.quantity <= 1}
                                                >
                                                    <div className="icon-minus text-sm"></div>
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => window.removeFromCart && window.removeFromCart(item.id)}
                                            className="text-red-500 bg-red-50 hover:bg-red-100 p-3 rounded-xl transition-colors flex-shrink-0 shadow-sm border border-red-100"
                                            title="حذف من السلة"
                                        >
                                            <div className="icon-trash-2 text-xl"></div>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="pt-4 border-t-2 border-dashed border-gray-200 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                            <div className="flex justify-between items-center text-xl font-extrabold text-[var(--text-dark)]">
                                <span>المجموع الكلي:</span>
                                <span>{calculateTotal().toLocaleString()} د.ج</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="w-full lg:w-2/3 order-2 lg:order-1">
                    <div className="bg-white rounded-2xl shadow-xl border border-[var(--secondary)] overflow-hidden">
                        <div className="bg-[var(--accent)] py-4 px-6 text-white text-center font-bold">
                            <p>الدفع عند الاستلام - Cash on Delivery</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-bold mb-2">الاسم الكامل</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                                        placeholder="الاسم واللقب"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-bold mb-2">رقم الهاتف</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        pattern="[0-9]{10}"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all text-left ltr"
                                        placeholder="05/06/07..."
                                        dir="ltr"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">الولاية</label>
                                    <select
                                        name="wilaya"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                                        onChange={handleChange}
                                    >
                                        <option value="">اختر الولاية</option>
                                        {wilayas.map((w, i) => (
                                            <option key={i} value={w}>{i + 1} - {w}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">البلدية</label>
                                    <input
                                        type="text"
                                        name="baladiya"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                                        placeholder="اسم البلدية"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-2">نوع التوصيل</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${formData.deliveryType === 'home' ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.deliveryType === 'home' ? 'border-[var(--primary)]' : 'border-gray-300'}`}>
                                            {formData.deliveryType === 'home' && <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="deliveryType"
                                            value="home"
                                            defaultChecked
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="font-bold">توصيل للمنزل</span>
                                    </label>
                                    <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${formData.deliveryType === 'office' ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.deliveryType === 'office' ? 'border-[var(--primary)]' : 'border-gray-300'}`}>
                                            {formData.deliveryType === 'office' && <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="deliveryType"
                                            value="office"
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="font-bold">توصيل للمكتب (Stop Desk)</span>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 text-xl flex justify-center items-center gap-3">
                                <span>تأكيد الطلب عبر واتساب</span>
                                <div className="icon-message-circle text-2xl"></div>
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-4 leading-relaxed bg-gray-50 p-4 rounded-lg">
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
