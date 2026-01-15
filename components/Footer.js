function Footer({ isAdmin }) {
    return (
        <footer className="py-10 bg-[var(--bg-light)]">
            <div className="container mx-auto px-4 flex flex-col items-center">

                {/* Social Media Section */}
                <div className="flex flex-col items-center gap-6 mb-8 w-full">
                    <h3 className="text-2xl font-bold text-[var(--primary)] drop-shadow-sm">هويتنا على مواقع التواصل الاجتماعي</h3>
                    <div className="flex gap-6 items-center justify-center">
                        <a href="https://wa.me/213664925052" target="_blank" rel="noreferrer" className="transform hover:scale-110 transition-transform duration-300">
                            <img src="./assets/whatsapp.png" alt="WhatsApp" className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-md" />
                        </a>
                        <a href="https://www.facebook.com/desertshop.dz" target="_blank" rel="noreferrer" className="transform hover:scale-110 transition-transform duration-300">
                            <img src="./assets/facebook.png" alt="Facebook" className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-md" />
                        </a>
                        <a href="https://www.instagram.com/x_desert.shop_x/" target="_blank" rel="noreferrer" className="transform hover:scale-110 transition-transform duration-300">
                            <img src="./assets/instagram.png" alt="Instagram" className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-md" />
                        </a>
                        <a href="https://www.tiktok.com/@desertshop.online?lang=en-GB" target="_blank" rel="noreferrer" className="transform hover:scale-110 transition-transform duration-300">
                            <img src="./assets/tiktok.png" alt="TikTok" className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-md" />
                        </a>
                    </div>
                </div>

                <div className="w-full border-t border-[var(--secondary)] my-6"></div>

                {/* Copyright */}
                <div className="flex flex-col md:flex-row items-center justify-center w-full text-gray-600 text-sm gap-4">
                    <div className="flex items-center gap-4">
                        <img src="./assets/logo.webp" alt="Desert Shop Logo" className="h-12 w-auto object-contain bg-white/50 rounded-full p-1" />
                        <p>© 2026 جمالك الخارجي. جميع الحقوق محفوظة.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}