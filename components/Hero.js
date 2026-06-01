function Hero() {
    const heroImgSrc = (window.siteSettings && window.siteSettings.heroImage)
        ? window.siteSettings.heroImage
        : "https://images.unsplash.com/photo-1599695663667-73b22415170d?q=80&w=800&auto=format&fit=crop";

    return (
        <section className="relative overflow-hidden py-16 md:py-28 px-4" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #fff1ec 0%, #fff7f4 60%)' }}>
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-[var(--primary)]/25 to-transparent blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[var(--secondary)]/20 to-transparent blur-3xl"></div>
            </div>

            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 relative z-10">
                {/* Image Area */}
                <div className="relative w-72 h-72 md:w-[420px] md:h-[420px] flex-shrink-0 animate-float">
                    {/* Decorative rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--primary)]/20 animate-spin" style={{ animationDuration: '20s' }}></div>
                    <div className="absolute inset-4 rounded-full border border-[var(--secondary)]/30"></div>
                    
                    {/* Main image container */}
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-1 shadow-2xl">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            <img
                                src={heroImgSrc}
                                alt="Hero"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                    </div>
                    
                    {/* Floating badges */}
                    <div className="absolute top-0 right-0 bg-white rounded-2xl px-4 py-2 shadow-lg border border-[var(--border-color)] animate-bounce" style={{ animationDuration: '3s' }}>
                        <span className="text-[var(--primary)] font-bold text-sm">✨ منتجات أصلية</span>
                    </div>
                    <div className="absolute bottom-8 -left-4 bg-white rounded-2xl px-4 py-2 shadow-lg border border-[var(--border-color)]" style={{ animation: 'bounce 3s infinite', animationDelay: '1s' }}>
                        <span className="text-[var(--secondary)] font-bold text-sm">🚚 توصيل سريع</span>
                    </div>
                </div>

                {/* Text Area */}
                <div className="text-center md:text-right flex flex-col items-center md:items-start z-10 max-w-lg">
                    <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2 rounded-full text-sm font-bold mb-6">
                        <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></span>
                        متجر متخصص للمرأة الجزائرية
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
                        <span className="text-gradient">جمالك</span><br />
                        <span className="text-[var(--text-dark)]">الخارجي</span>
                    </h1>

                    <p className="text-[var(--text-muted)] text-lg mb-8 leading-relaxed">
                        اكتشفي مجموعتنا الفاخرة من منتجات العناية بالبشرة والشعر. 
                        منتجات أصلية 100% مع ضمان الجودة والتوصيل لجميع الولايات.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <a href="#/products" className="btn-primary flex items-center gap-2 text-lg">
                            <span>تصفحي المنتجات</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </a>
                        <a href="#/categories" className="px-6 py-3 rounded-xl font-bold border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300">
                            تصفحي الفئات
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 mt-10 pt-8 border-t border-[var(--border-color)]">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[var(--primary)]">+5000</div>
                            <div className="text-sm text-[var(--text-muted)]">عميلة سعيدة</div>
                        </div>
                        <div className="w-px h-12 bg-[var(--border-color)]"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[var(--primary)]">100%</div>
                            <div className="text-sm text-[var(--text-muted)]">منتجات أصلية</div>
                        </div>
                        <div className="w-px h-12 bg-[var(--border-color)]"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[var(--primary)]">58</div>
                            <div className="text-sm text-[var(--text-muted)]">ولاية مغطاة</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}