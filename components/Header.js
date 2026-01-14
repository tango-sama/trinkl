function Header() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { Link } = ReactRouterDOM;

    const isLoggedIn = sessionStorage.getItem('adminToken') === 'true';

    return (
        <header className="sticky top-0 z-50 bg-[var(--bg-light)]/90 backdrop-blur-md shadow-sm border-b border-[var(--secondary)]">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo / Brand Name */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="./assets/logo.png" alt="Desert Shop Logo" className="h-16 w-auto object-contain hover:scale-105 transition-transform" />
                    </Link>
                    {isLoggedIn && (
                        <Link to="/admin-desert-shop" className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition-colors hidden md:block">
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
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-[var(--primary)] p-1 rounded hover:bg-[var(--secondary)]/20"
                >
                    <div className={isOpen ? "icon-x text-2xl" : "icon-menu text-2xl"}></div>
                </button>
            </div>

            {/* Mobile Nav Dropdown */}
            {isOpen && (
                <nav className="md:hidden bg-[var(--bg-light)] border-t border-[var(--secondary)] px-4 py-4 flex flex-col gap-4 font-semibold text-[var(--text-dark)] shadow-lg animate-fade-in-down">
                    <Link to="/" onClick={() => setIsOpen(false)} className="block hover:text-[var(--primary)]">الرئيسية</Link>
                    <Link to="/categories" onClick={() => setIsOpen(false)} className="block hover:text-[var(--primary)]">التصنيفات</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className="block hover:text-[var(--primary)]">اتصل بنا</Link>
                </nav>
            )}
        </header>
    );
}