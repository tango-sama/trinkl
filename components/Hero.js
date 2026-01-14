function Hero() {
    return (
        <section className="relative overflow-hidden py-12 md:py-20 px-4">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">

                {/* Image Circle Area */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 flex-shrink-0">
                    {/* Decorative Circle Background */}
                    <div className="absolute inset-0 rounded-full bg-[var(--primary)] opacity-20 transform translate-x-4 translate-y-4"></div>
                    <div className="absolute inset-0 rounded-full bg-[var(--primary)] opacity-80 overflow-hidden border-4 border-[var(--bg-light)] shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1599695663667-73b22415170d?q=80&w=800&auto=format&fit=crop"
                            alt="Woman Beauty"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Decorative Stars/Sparkles */}
                    <div className="absolute -top-4 -right-4 text-[var(--primary)] animate-pulse">
                        <div className="icon-sparkles text-4xl"></div>
                    </div>
                </div>

                {/* Text Area */}
                <div className="text-center md:text-right flex flex-col items-center md:items-start z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--primary)] mb-2 leading-tight">
                        جمالك<br />
                        <span className="text-[var(--text-dark)]">الخارجي</span>
                    </h1>

                    <div className="bg-[var(--primary)] text-white text-lg md:text-xl px-6 py-2 rounded-lg mt-4 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                        لوحة فنية تسر الأعين و تثير الإعجاب
                    </div>
                </div>
            </div>
        </section>
    );
}