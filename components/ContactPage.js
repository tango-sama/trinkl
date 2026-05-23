function ContactPage() {
    const [formData, setFormData] = React.useState({ name: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await window.db.addDocument('messages', {
                ...formData,
                timestamp: Date.now()
            });
            setSubmitted(true);
            setFormData({ name: '', phone: '', message: '' });
        } catch (error) {
            console.error(error);
            alert('فشل إرسال الرسالة');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 min-h-[60vh]">
            <div className="text-center mb-12">
                <span className="text-sm text-[var(--primary)] font-bold mb-2 block">نحن هنا لمساعدتك</span>
                <h1 className="text-4xl font-bold text-[var(--text-dark)] mb-4">اتصلي بنا</h1>
                <p className="text-[var(--text-muted)] max-w-lg mx-auto">
                    فريقنا جاهز للإجابة على استفساراتك ومساعدتك في اختيار المنتجات المناسبة
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-[var(--border-color)]">
                        <h2 className="text-xl font-bold text-[var(--text-dark)] mb-6">معلومات التواصل</h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center text-[var(--primary)]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--text-dark)]">الهاتف</p>
                                    <p className="text-[var(--text-muted)]" dir="ltr">+213 662 70 58 30</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--text-dark)]">واتساب</p>
                                    <a href="https://wa.me/213662705830" target="_blank" rel="noreferrer" className="text-green-600 hover:underline">
                                        تواصلي مباشرة
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[var(--secondary)]/10 rounded-xl flex items-center justify-center text-[var(--secondary)]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--text-dark)]">الموقع</p>
                                    <p className="text-[var(--text-muted)]">الجزائر العاصمة</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick WhatsApp CTA */}
                    <a
                        href="https://wa.me/213662705830"
                        target="_blank"
                        rel="noreferrer"
                        className="block bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">تواصلي عبر واتساب</h3>
                                <p className="text-white/80 text-sm">رد سريع مضمون خلال دقائق</p>
                            </div>
                        </div>
                    </a>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[var(--border-color)]">
                    {submitted ? (
                        <div className="text-center py-12 animate-scale-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-2">تم إرسال رسالتك!</h3>
                            <p className="text-[var(--text-muted)] mb-6">سنقوم بالرد عليك في أقرب وقت</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-[var(--primary)] font-bold hover:underline"
                            >
                                إرسال رسالة أخرى
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-[var(--text-dark)] mb-6">أرسلي رسالة</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-[var(--text-dark)] font-bold mb-2">الاسم</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all bg-[var(--bg-light)]"
                                        placeholder="اسمك الكامل"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[var(--text-dark)] font-bold mb-2">رقم الهاتف</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all bg-[var(--bg-light)] text-left"
                                        placeholder="05/06/07..."
                                        dir="ltr"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[var(--text-dark)] font-bold mb-2">الرسالة</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all bg-[var(--bg-light)] resize-none"
                                        placeholder="اكتبي رسالتك هنا..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary w-full text-lg py-4 disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            جاري الإرسال...
                                        </span>
                                    ) : (
                                        'إرسال الرسالة'
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}