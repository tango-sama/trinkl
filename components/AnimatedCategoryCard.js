const AnimatedCategoryCard = ({ title, images, description, href, stats = [] }) => {
    const { Link } = ReactRouterDOM;
    const [isCentered, setIsCentered] = React.useState(false);
    const cardRef = React.useRef(null);

    React.useEffect(() => {
        // Only run this logic on mobile
        const checkMobile = () => window.innerWidth < 768;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Toggle state based on whether the card is in the center area of the viewport
                // BUT only if we are on a mobile device
                if (checkMobile()) {
                    setIsCentered(entry.isIntersecting);
                } else {
                    setIsCentered(false);
                }
            },
            {
                root: null,
                rootMargin: '-40% 0px -40% 0px', // Trigger only when element is in the vertical middle 20% of screen
                threshold: 0
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        // Add resize listener to reset state if moving to desktop
        const handleResize = () => {
            if (!checkMobile()) {
                setIsCentered(false);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (cardRef.current) observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Helper to conditionally apply classes
    const getTransformClass = (baseClass) => {
        return isCentered ? `${baseClass} mobile-hover-effect` : baseClass;
    };

    return (
        <Link
            to={href}
            ref={cardRef}
            className={`group relative block w-full cursor-pointer rounded-3xl border border-[var(--secondary)]/20 bg-white p-6 shadow-sm transition-all duration-500 ease-in-out overflow-hidden hover:-translate-y-2 hover:shadow-2xl ${isCentered ? '-translate-y-2 shadow-2xl' : ''}`}
            aria-label={title}
        >
            <div className="flex flex-col h-full">
                {/* Card Header: Title and Arrow */}
                <div className="mb-8 flex items-center justify-between">
                    <h2 className={`text-2xl font-extrabold tracking-tight text-[var(--text-dark)] transition-colors duration-300 group-hover:text-[var(--primary)] ${isCentered ? 'text-[var(--primary)]' : ''}`}>{title}</h2>
                    <div className={`w-10 h-10 rounded-full bg-[var(--bg-light)] flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--primary)] group-hover:text-white ${isCentered ? 'bg-[var(--primary)] text-white' : ''}`}>
                        {window.Icons && window.Icons['arrow-left'] ?
                            React.createElement(window.Icons['arrow-left'], { className: `w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1 ${isCentered ? '-translate-x-1' : ''}` }) :
                            <i className={`lucide-arrow-left text-lg transition-transform duration-300 group-hover:-translate-x-1 ${isCentered ? '-translate-x-1' : ''}`}></i>
                        }
                    </div>
                </div>

                {/* Stacked Images Animation */}
                <div className="relative mb-8 h-44 flex items-center">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className={`absolute h-full w-[45%] overflow-hidden rounded-2xl border-4 border-white shadow-lg transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:!translate-x-[var(--tx)] group-hover:!rotate-[var(--r)] group-hover:!scale-105 ${isCentered ? '!translate-x-[var(--tx)] !rotate-[var(--r)] !scale-105' : ''}`}
                            style={{
                                transform: isCentered ? undefined : `translateX(${-index * 30}px) rotate(${-index * 2}deg)`,
                                '--tx': `${-index * 80}px`,
                                '--r': `${-(index - 1) * 10}deg`,
                                zIndex: images.length - index,
                                right: '20%' // Start from a bit inside
                            }}
                        >
                            <img
                                src={src || './assets/placeholder.png'}
                                alt={`${title} ${index + 1}`}
                                className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${isCentered ? 'scale-110' : ''}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4=';
                                }}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${isCentered ? 'opacity-100' : ''}`}></div>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                {stats.length > 0 && (
                    <div className="mt-auto mb-4 flex items-center gap-4 text-xs font-bold text-gray-500">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--bg-light)] text-[var(--text-dark)]">
                                {stat.icon}
                                <span>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Description */}
                <p className={`text-sm leading-relaxed text-gray-500 transition-colors line-clamp-2 group-hover:text-gray-700 ${isCentered ? 'text-gray-700' : ''}`}>
                    {description}
                </p>
            </div>

            {/* Elegant Background elements */}
            <div className={`absolute -bottom-4 -left-4 w-24 h-24 bg-[var(--secondary)] rounded-full blur-2xl transition-all duration-700 opacity-10 group-hover:scale-150 group-hover:opacity-20 ${isCentered ? 'scale-150 opacity-20' : ''}`}></div>
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-[var(--primary)] rounded-full blur-3xl transition-all duration-700 opacity-5 group-hover:scale-150 group-hover:opacity-10 ${isCentered ? 'scale-150 opacity-10' : ''}`}></div>
        </Link>
    );
};

window.AnimatedCategoryCard = AnimatedCategoryCard;
