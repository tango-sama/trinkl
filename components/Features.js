function Features() {
    const features = [
        { 
            id: 1, 
            title: "الدفع عند الإستلام", 
            subtitle: "توصيل لـ 58 ولاية", 
            icon: "banknote",
            color: "from-[var(--primary)] to-[var(--primary-dark)]"
        },
        { 
            id: 2, 
            title: "منتجات أصلية", 
            subtitle: "ضمان الجودة 100%", 
            icon: "shield-check",
            color: "from-green-500 to-green-600"
        },
        { 
            id: 3, 
            title: "توصيل سريع", 
            subtitle: "إلى باب المنزل", 
            icon: "truck",
            color: "from-blue-500 to-blue-600"
        },
        { 
            id: 4, 
            title: "خدمة زبائن", 
            subtitle: "7/7 أيام", 
            icon: "headset",
            color: "from-purple-500 to-purple-600"
        }
    ];

    const getIcon = (iconName) => {
        const icons = {
            banknote: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>,
            "shield-check": <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
            truck: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
            headset: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
        };
        return icons[iconName] || null;
    };

    return (
        <section className="py-16 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {features.map((feature, index) => (
                        <div 
                            key={feature.id} 
                            className="group luxury-card card-hover p-6 text-center"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                {getIcon(feature.icon)}
                            </div>
                            <h3 className="font-bold text-[var(--text-dark)] text-lg mb-1">{feature.title}</h3>
                            <p className="text-[var(--text-muted)] text-sm">{feature.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}