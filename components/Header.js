function Header({ cartCount = 0 }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { Link, useLocation } = ReactRouterDOM;
    const { IconShoppingCart, IconMenu, IconX } = window.Icons;

    const isLoggedIn = sessionStorage.getItem('adminToken') === 'true';

    // Close on Back Button
    React.useEffect(() => {
        if (!isOpen) return;

        window.history.pushState({ menuOpen: true }, '');

        const handlePopState = () => setIsOpen(false);
        const handleEsc = (e) => { if (e.key === 'Escape') window.history.back(); };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('keydown', handleEsc);
            if (window.history.state?.menuOpen) window.history.back();
        };
    }, [isOpen]);

    // Close on Route Change
    const location = useLocation();
    React.useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <header className="sticky top-0 z-50 bg-[var(--bg-light)]/90 backdrop-blur-md shadow-sm border-b border-[var(--secondary)]">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo / Brand Name */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="./assets/logo.webp" alt="Desert Shop Logo" className="h-16 w-auto object-contain hover:scale-105 transition-transform" />
                    </Link>
                    {isLoggedIn && (
                        <Link to="/amelhadj" className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition-colors">
                            لوحة التحكم
                        </Link>
                    )}
                </div>

                {/* Desktop Nav */}
                <div className="hidden lg:block text-center absolute left-1/2 transform -translate-x-1/2">
                    <span className="text-[var(--text-dark)]/80 font-bold border-b border-[var(--primary)] pb-0.5">
                        جودة، ضمان ومصداقية
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-semibold text-[var(--text-dark)]">
                    <Link to="/" className="hover:text-[var(--primary)] transition-colors">الرئيسية</Link>
                    <Link to="/categories" className="hover:text-[var(--primary)] transition-colors">التصنيفات</Link>
                    <Link to="/contact" className="hover:text-[var(--primary)] transition-colors">اتصل بنا</Link>

                    {/* Cart Icon */}
                    <Link to="/checkout" className="relative bg-[var(--primary)]/10 p-2 rounded-full hover:bg-[var(--primary)]/20 transition-colors text-[var(--primary)]">
                        <IconShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </nav>

                {/* Backdrop for Mobile Menu */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                        onClick={() => setIsOpen(false)}
                    ></div>
                )}

                {/* Mobile Menu Button + Cart */}
                <div className="flex items-center gap-4 md:hidden relative z-50">
                    <Link to="/checkout" className="relative text-[var(--primary)]">
                        <IconShoppingCart className="w-7 h-7" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full shadow-sm font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-[var(--primary)] p-1 rounded hover:bg-[var(--secondary)]/20"
                    >
                        {isOpen ? <IconX className="w-7 h-7" /> : <IconMenu className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            <nav className={`md:hidden bg-[var(--bg-light)] border-[var(--secondary)] px-4 flex flex-col gap-4 font-semibold text-[var(--text-dark)] shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-50 ${isOpen ? 'max-h-[80vh] py-4 border-t opacity-100' : 'max-h-0 py-0 border-t-0 opacity-0'}`}>
                <Link to="/" onClick={() => setIsOpen(false)} className="block hover:text-[var(--primary)]">الرئيسية</Link>
                <Link to="/categories" onClick={() => setIsOpen(false)} className="block hover:text-[var(--primary)]">التصنيفات</Link>
                <Link to="/contact" onClick={() => setIsOpen(false)} className="block hover:text-[var(--primary)]">اتصل بنا</Link>
                <Link to="/checkout" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-[var(--primary)] font-bold">
                    <span>سلة المشتريات ({cartCount})</span>
                    <IconShoppingCart className="w-5 h-5" />
                </Link>
            </nav>
        </header>
    );
}