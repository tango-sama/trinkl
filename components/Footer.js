function Footer({ isAdmin }) {
    if (isAdmin) return null;

    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-white mt-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #37145f 0%, #240b40 100%)' }}>
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]"></div>
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[var(--secondary)]/10 blur-3xl"></div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img src="./assets/logo.webp" alt="Desert Shop" className="h-16 w-auto" />
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                            متجر متخصص في منتجات الجمال والعناية بالشعر والبشرة. نقدم منتجات أصلية 100% مع توصيل لجميع ولايات الجزائر.
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--secondary)] transition-all hover:scale-110">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                            </a>
                            <a href="https://www.facebook.com/share/1KbucDXk34/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--secondary)] transition-all hover:scale-110">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            </a>
                            <a href="https://wa.me/213662705830" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500 transition-all hover:scale-110">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">روابط سريعة</h3>
                        <ul className="space-y-3">
                            {[
                                { to: '/', label: 'الرئيسية' },
                                { to: '/products', label: 'المنتجات' },
                                { to: '/categories', label: 'التصنيفات' },
                                { to: '/contact', label: 'اتصل بنا' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <ReactRouterDOM.Link 
                                        to={link.to} 
                                        className="text-white/70 hover:text-[var(--secondary)] transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {link.label}
                                    </ReactRouterDOM.Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">التصنيفات</h3>
                        <ul className="space-y-3">
                            {(window.categories || []).slice(0, 6).map((cat) => (
                                <li key={cat.id}>
                                    <ReactRouterDOM.Link 
                                        to={`/category/${cat.id}`} 
                                        className="text-white/70 hover:text-[var(--secondary)] transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {cat.name}
                                    </ReactRouterDOM.Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">تواصل معنا</h3>
                        <ul className="space-y-3 text-white/70">
                            <li className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                </div>
                                <span dir="ltr">+213 662 70 58 30</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                </div>
                                <span>contact@desertshop.dz</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                </div>
                                <span>الجزائر العاصمة</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/70 text-sm">
                        © {currentYear} Desert Shop. جميع الحقوق محفوظة.
                    </p>
                    <p className="text-white/70 text-sm">
                        صنع بـ ❤️ في الجزائر
                    </p>
                </div>
            </div>
        </footer>
    );
}