function Header({ cartCount = 0 }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const { Link, useLocation } = ReactRouterDOM;
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/amelhadj');

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
    React.useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { to: '/', label: 'الرئيسية' },
        { to: '/categories', label: 'التصنيفات' },
        { to: '/products', label: 'المنتجات' },
        { to: '/contact', label: 'اتصل بنا' },
    ];

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-[rgba(255,247,244,0.9)] backdrop-blur-xl shadow-[0_8px_30px_rgba(224,114,140,0.15)] border-b border-[var(--border-color)]'
                    : 'bg-transparent'
            }`}>
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="relative">
                                <img src="./assets/logo.webp" alt="Desert Shop Logo" className="h-14 w-auto object-contain group-hover:scale-105 transition-transform" />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                                    location.pathname === link.to || location.pathname === link.to + '/'
                                        ? 'bg-[var(--primary)] text-white shadow-md'
                                        : 'text-[var(--text-dark)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Cart & Mobile Menu */}
                    <div className="flex items-center gap-3">
                        {/* Cart */}
                        <Link 
                            to="/checkout" 
                            className="relative bg-[var(--primary)]/10 p-2.5 rounded-xl hover:bg-[var(--primary)]/20 transition-all text-[var(--primary)]"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-[var(--primary)] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md font-bold animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2.5 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-all"
                        >
                            {isOpen ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="fixed top-0 right-0 h-full w-72 bg-white border-l border-[var(--border-color)] shadow-2xl z-50 md:hidden animate-slide-up">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <img src="./assets/logo.webp" alt="Logo" className="h-12 w-auto" />
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-xl bg-[var(--bg-beige)] text-[var(--text-muted)] hover:bg-[var(--primary)]/10 transition-all"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </div>
                            <nav className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setIsOpen(false)}
                                        className={`px-4 py-3 rounded-xl font-bold transition-all ${
                                            location.pathname === link.to || location.pathname === link.to + '/'
                                                ? 'bg-[var(--primary)] text-white shadow-md'
                                                : 'text-[var(--text-dark)] hover:bg-[var(--bg-beige)]'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}