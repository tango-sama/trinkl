function Hero() {
    const heroImgSrc = (window.siteSettings && window.siteSettings.heroImage)
        ? window.siteSettings.heroImage
        : "https://images.unsplash.com/photo-1599695663667-73b22415170d?q=80&w=800&auto=format&fit=crop";

    return (
        <section
            className="relative overflow-hidden py-16 md:py-28 px-4 text-white"
            style={{ background: 'radial-gradient(1200px 700px at 50% -10%, #5a2596 0%, #37145f 45%, #240b40 100%)' }}
        >
            {/* Glowing orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--secondary)]/30 blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[var(--accent)]/30 blur-3xl"></div>
                <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-[var(--rose-soft)]/20 blur-3xl"></div>
            </div>

            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 relative z-10">
                {/* Image Area */}
                <div className="relative w-72 h-72 md:w-[420px] md:h-[420px] flex-shrink-0 animate-float">
                    {/* Gold glow disc */}
                    <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle, rgba(242,217,139,0.55) 0%, rgba(155,111,212,0.3) 38%, transparent 68%)' }}></div>
                    {/* Decorative gold rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--gold-light)]/35 animate-spin" style={{ animationDuration: '24s' }}></div>
                    <div className="absolute inset-4 rounded-full border border-[var(--rose-soft)]/30"></div>

                    {/* Main image container */}
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[var(--gold-light)] via-[var(--gold)] to-[var(--secondary)] p-1 shadow-2xl">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            <img
                                src={heroImgSrc}
                                alt="Hero"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    {/* Floating badges */}
                    <div className="absolute top-0 right-0 bg-white rounded-2xl px-4 py-2 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                        <span className="text-[var(--primary)] font-bold text-sm">✨ منتجات أصلية</span>
                    </div>
                    <div className="absolute bottom-8 -left-4 bg-white rounded-2xl px-4 py-2 shadow-xl" style={{ animation: 'bounce 3s infinite', animationDelay: '1s' }}>
                        <span className="text-[var(--gold)] font-bold text-sm">🚚 توصيل سريع</span>
                    </div>
                </div>

                {/* Text Area */}
                <div className="text-center md:text-right flex flex-col items-center md:items-start z-10 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 text-[var(--gold-light)]" style={{ background: 'rgba(242,217,139,0.12)', border: '1px solid rgba(242,217,139,0.35)' }}>
                        <span className="w-2 h-2 bg-[var(--gold-light)] rounded-full animate-pulse"></span>
                        متجر متخصص للمرأة الجزائرية
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
                        <span className="text-gradient">جمالك</span><br />
                        <span className="text-white">الخارجي</span>
                    </h1>

                    <p className="text-white/80 text-lg mb-8 leading-relaxed">
                        اكتشفي مجموعتنا الفاخرة من منتجات العناية بالبشرة والشعر.
                        منتجات أصلية 100% مع ضمان الجودة والتوصيل لجميع الولايات.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <a href="#/products" className="btn-gold flex items-center gap-2 text-lg">
                            <span>تصفحي المنتجات</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </a>
                        <a href="#/categories" className="px-6 py-3 rounded-full font-bold border-2 border-[var(--gold-light)]/60 text-[var(--gold-light)] hover:bg-[var(--gold-light)] hover:text-[var(--primary-dark)] transition-all duration-300">
                            تصفحي الفئات
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/15">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[var(--gold-light)]">+5000</div>
                            <div className="text-sm text-white/70">عميلة سعيدة</div>
                        </div>
                        <div className="w-px h-12 bg-white/15"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[var(--gold-light)]">100%</div>
                            <div className="text-sm text-white/70">منتجات أصلية</div>
                        </div>
                        <div className="w-px h-12 bg-white/15"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[var(--gold-light)]">58</div>
                            <div className="text-sm text-white/70">ولاية مغطاة</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
