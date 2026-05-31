function WhatsAppFloat() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [showTooltip, setShowTooltip] = React.useState(true);

    React.useEffect(() => {
        // Show button after scrolling a bit
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        
        // Hide tooltip after 5 seconds
        const tooltipTimer = setTimeout(() => setShowTooltip(false), 5000);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(tooltipTimer);
        };
    }, []);

    return (
        <div className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full left-0 mb-3 bg-white rounded-xl shadow-lg px-4 py-3 border border-[var(--border-color)] animate-fade-in whitespace-nowrap">
                    <p className="text-sm font-bold text-[var(--text-dark)]">تحتاجي مساعدة؟ 💬</p>
                    <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b border-r border-[var(--border-color)] transform rotate-45"></div>
                </div>
            )}
            
            {/* Button */}
            <a
                href="https://wa.me/213662705830"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 bg-gradient-to-br from-[#1a7a34] to-[#25d366] text-white px-5 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 animate-pulse-cta"
                onMouseEnter={() => setShowTooltip(false)}
            >
                <div className="relative">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-green-500 animate-pulse"></span>
                </div>
                <span className="font-bold text-sm hidden md:block">تواصلي معنا</span>
            </a>
        </div>
    );
}