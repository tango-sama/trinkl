function CheckoutPage() {
    const [formData, setFormData] = React.useState({
        name: '',
        phone: '',
        wilaya: '',
        baladiya: '',
        deliveryType: 'home'
    });

    const wilayas = window.wilayas || [];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct standard WhatsApp message
        const message = `
*طلب جديد من Desert Shop* 🌵
---------------------------
👤 الاسم: ${formData.name}
📱 الهاتف: ${formData.phone}
📍 العنوان: ${formData.wilaya} - ${formData.baladiya}
🚚 التوصيل: ${formData.deliveryType === 'home' ? 'للمنزل (58 ولاية)' : 'للمكتب'}
---------------------------
يرجى تأكيد الطلب.
        `.trim();

        const whatsappUrl = `https://wa.me/213500000000?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-[var(--text-dark)] mb-8">إتمام الطلب</h1>

            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-[var(--secondary)] overflow-hidden">
                <div className="bg-[var(--accent)] py-4 px-6 text-white text-center">
                    <p>الدفع عند الاستلام - Cash on Delivery</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">الاسم الكامل</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 outline-none transition-all"
                            placeholder="الاسم واللقب"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">رقم الهاتف (الجزائر)</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            pattern="[0-9]{10}"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 outline-none transition-all"
                            placeholder="05/06/07..."
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">الولاية</label>
                            <select
                                name="wilaya"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 outline-none transition-all"
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
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 outline-none transition-all"
                                placeholder="اسم البلدية"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">نوع التوصيل</label>
                        <div className="flex gap-4">
                            <label className="flex-1 border rounded-lg p-4 cursor-pointer hover:bg-[var(--bg-light)] transition-colors flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="deliveryType"
                                    value="home"
                                    defaultChecked
                                    onChange={handleChange}
                                    className="w-5 h-5 text-[var(--primary)]"
                                />
                                <span>توصيل للمنزل</span>
                            </label>
                            <label className="flex-1 border rounded-lg p-4 cursor-pointer hover:bg-[var(--bg-light)] transition-colors flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="deliveryType"
                                    value="office"
                                    onChange={handleChange}
                                    className="w-5 h-5 text-[var(--primary)]"
                                />
                                <span>توصيل للمكتب (Stop Desk)</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors text-xl flex justify-center items-center gap-2">
                        <span>تأكيد الطلب via WhatsApp</span>
                        <div className="icon-message-circle"></div>
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        سيتم توجيهك إلى واتساب لتأكيد الطلب مع خدمة العملاء
                    </p>
                </form>
            </div>
        </div>
    );
}
