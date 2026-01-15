function Footer({ isAdmin }) {
    const { IconSparkles, IconInstagram, IconFacebook, IconTikTok, IconWhatsApp } = window.Icons;

    return (
        <footer className="py-10 bg-[var(--bg-light)]">
            <div className="container mx-auto px-4 flex flex-col items-center">

                {/* Large Bottom CTA Button - Hidden on Admin Pages */}
                {!isAdmin && (
                    <ReactRouterDOM.Link to="/categories" className="bg-[var(--primary)] hover:bg-[#7a4655] text-white text-xl md:text-2xl font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-10 flex items-center gap-3">
                        <IconSparkles className="text-2xl w-8 h-8" />
                        <span>اكتشفي ما هو جديد</span>
                    </ReactRouterDOM.Link>
                )}

                <div className="w-full border-t border-[var(--secondary)] my-6"></div>

                <div className="flex flex-col md:flex-row items-center justify-between w-full text-gray-600 text-sm gap-4">
                    <div className="flex items-center gap-4">
                        <img src="./assets/logo.webp" alt="Desert Shop Logo" className="h-12 w-auto object-contain bg-white/50 rounded-full p-1" />
                        <p>© 2026 جمالك الخارجي. جميع الحقوق محفوظة.</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <a href="https://wa.me/213664925052" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-[var(--primary)] text-white rounded-lg shadow-sm hover:scale-110 transition-transform">
                            <IconWhatsApp className="w-5 h-5" />
                        </a>
                        <a href="https://www.facebook.com/desertshop.dz" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-[var(--primary)] text-white rounded-lg shadow-sm hover:scale-110 transition-transform">
                            <IconFacebook className="w-5 h-5" />
                        </a>
                        <a href="https://www.instagram.com/x_desert.shop_x/" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-[var(--primary)] text-white rounded-lg shadow-sm hover:scale-110 transition-transform">
                            <IconInstagram className="w-5 h-5" />
                        </a>
                        <a href="https://www.tiktok.com/@desertshop.online?lang=en-GB" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-[var(--primary)] text-white rounded-lg shadow-sm hover:scale-110 transition-transform">
                            <IconTikTok className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}