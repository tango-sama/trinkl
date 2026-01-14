function Features() {
    // We reuse the features data from utils/data.js (passed as props or accessed globally if included)
    // Here we'll just use the global variable 'features' defined in data.js since we load it before this script
    
    return (
        <section id="features" className="py-12 bg-[#F2D5D5]/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-dark)]">ما يميزنا</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 mb-4 flex items-center justify-center text-[var(--primary)] transition-transform duration-300 group-hover:scale-110">
                                {/* Dynamic Icon rendering */}
                                <div className={`icon-${feature.icon} text-5xl`}></div>
                            </div>
                            <h3 className="font-bold text-lg text-[var(--text-dark)] mb-1">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}