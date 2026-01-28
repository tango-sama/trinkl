function ContactPage() {
    const [formData, setFormData] = React.useState({
        name: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, phone, message } = formData;

        if (!name || !phone || !message) {
            alert('يرجى ملء جميع الحقول');
            return;
        }

        try {
            // Save to Firestore 'messages' collection
            await window.db.addDocument('messages', {
                name,
                phone,
                message,
                timestamp: Date.now(),
                read: false
            });

            alert('تم إرسال رسالتك بنجاح! سنتصل بك قريباً.');
            setFormData({ name: '', phone: '', message: '' }); // Reset form
        } catch (error) {
            console.error("Error sending message:", error);
            alert('عذراً، حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً أو الاتصال بنا هاتفياً.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-[var(--secondary)] overflow-hidden">
                <div className="bg-[var(--primary)] py-6 px-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">اتصل بنا</h1>
                    <p className="text-[var(--bg-light)] opacity-90">نحن هنا لمساعدتك</p>
                </div>

                <div className="p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">الاسم</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 outline-none transition-all"
                                placeholder="الاسم الكامل"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2">رقم الهاتف</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 outline-none transition-all dir-ltr text-right"
                                placeholder="06XXXXXXXX"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2">الرسالة</label>
                            <textarea
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 outline-none transition-all h-32"
                                placeholder="كيف يمكننا مساعدتك؟"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full bg-[var(--primary)] hover:bg-[#7a4655] text-white font-bold py-3 rounded-lg shadow transition-colors text-lg">
                            إرسال الرسالة
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center gap-8 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-[var(--bg-light)] flex items-center justify-center text-[var(--primary)]">
                                <span className="icon-mail text-xl"></span>
                            </div>
                            <span className="text-sm font-sans select-all">desertshop7@gmail.com</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-[var(--bg-light)] flex items-center justify-center text-[var(--primary)]">
                                <span className="icon-phone text-xl"></span>
                            </div>
                            <span className="text-sm font-sans select-all">0662705830</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
