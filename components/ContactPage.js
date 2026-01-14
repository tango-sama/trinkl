function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-[var(--secondary)] overflow-hidden">
                <div className="bg-[var(--primary)] py-6 px-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">اتصل بنا</h1>
                    <p className="text-[var(--bg-light)] opacity-90">نحن هنا لمساعدتك</p>
                </div>

                <div className="p-8">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">الاسم</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 outline-none transition-all" placeholder="الاسم الكامل" />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2">البريد الإلكتروني</label>
                            <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 outline-none transition-all" placeholder="example@email.com" />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2">الرسالة</label>
                            <textarea className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 outline-none transition-all h-32" placeholder="كيف يمكننا مساعدتك؟"></textarea>
                        </div>

                        <button type="button" className="w-full bg-[var(--primary)] hover:bg-[#7a4655] text-white font-bold py-3 rounded-lg shadow transition-colors text-lg">
                            إرسال الرسالة
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center gap-8 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-[var(--bg-light)] flex items-center justify-center text-[var(--primary)]">
                                <span className="icon-mail text-xl"></span>
                            </div>
                            <span className="text-sm">support@beauty.com</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-[var(--bg-light)] flex items-center justify-center text-[var(--primary)]">
                                <span className="icon-phone text-xl"></span>
                            </div>
                            <span className="text-sm">+213 664925052</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
