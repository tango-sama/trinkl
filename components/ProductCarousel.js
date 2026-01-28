function ProductCarousel() {
    const { useNavigate } = ReactRouterDOM;
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState(0);
    const [dragOffset, setDragOffset] = React.useState(0);

    React.useEffect(() => {
        const fetchFeaturedProducts = async () => {
            if (!window.db) {
                console.warn('[ProductCarousel] DB not found, retrying...');
                setTimeout(fetchFeaturedProducts, 500);
                return;
            }
            try {
                const products = await window.db.getCollection('featured_products');
                const sorted = products.sort((a, b) => (a.order || 0) - (b.order || 0));
                setFeaturedProducts(sorted);
            } catch (error) {
                console.error('[ProductCarousel] Error fetching products:', error);
                setFeaturedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    // Auto-advance every 5 seconds
    React.useEffect(() => {
        if (featuredProducts.length === 0 || isAnimating) return;

        const interval = setInterval(() => {
            prevProduct();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, featuredProducts.length, isAnimating]);

    const nextProduct = () => {
        if (isAnimating || featuredProducts.length === 0) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const prevProduct = () => {
        if (isAnimating || featuredProducts.length === 0) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const goToProduct = (index) => {
        if (isAnimating || index === currentIndex) return;
        setIsAnimating(true);
        setCurrentIndex(index);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const getProductAtIndex = (offset) => {
        if (featuredProducts.length === 0) return null;
        const index = (currentIndex + offset + featuredProducts.length) % featuredProducts.length;
        return featuredProducts[index];
    };

    // Handle touch swipe - with real-time drag offset
    const handleTouchStart = (e) => {
        const touch = e.targetTouches[0].clientX;
        setTouchStart(touch);
        setIsDragging(true);
        setDragStart(touch);
        setDragOffset(0);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const touch = e.targetTouches[0].clientX;
        setTouchEnd(touch);

        const diff = touch - dragStart;
        setDragOffset(diff);

        // Switch products when dragged far enough (same as mouse)
        const threshold = 150;
        if (diff > threshold) {
            const overflow = diff - threshold;
            setDragStart(touch - overflow);
            setDragOffset(overflow);
            setTimeout(() => prevProduct(), 0);
        } else if (diff < -threshold) {
            const overflow = diff + threshold;
            setDragStart(touch - overflow);
            setDragOffset(overflow);
            setTimeout(() => nextProduct(), 0);
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        const diff = dragOffset;
        setIsDragging(false);

        if (Math.abs(diff) > 60) {
            if (diff > 0) {
                prevProduct();
            } else {
                nextProduct();
            }
        }

        setTimeout(() => setDragOffset(0), 50);
        setTouchStart(0);
        setTouchEnd(0);
    };

    if (loading) {
        return (
            <section id="products" className="py-16 px-4 bg-white/50">
                <div className="container mx-auto flex items-center justify-center min-h-[400px]">
                    <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </section>
        );
    }

    if (featuredProducts.length === 0) {
        // Fallback - show message
        return (
            <section id="products" className="py-16 px-4 bg-white/50">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-[var(--primary)] text-white py-3 px-10 rounded-tl-3xl rounded-br-3xl shadow-lg transform -skew-x-12">
                            <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">المنتجات الأكثر مبيعاً</h2>
                        </div>
                    </div>
                    <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                        <p className="text-xl font-bold">لا توجد منتجات مميزة. قم بإضافتها من لوحة التحكم!</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="products" className="py-24 px-4 bg-gradient-to-b from-white/50 to-[var(--bg-light)] relative overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-transparent to-purple-100/30 pointer-events-none"></div>

            <div className="container mx-auto relative z-10">
                {/* Title */}
                <div className="text-center mb-12">
                    <div className="inline-block bg-[var(--primary)] text-white py-3 px-10 rounded-tl-3xl rounded-br-3xl shadow-lg transform -skew-x-12">
                        <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">المنتجات الأكثر مبيعاً</h2>
                    </div>
                </div>

                {/* Premium Infinite Carousel */}
                <div className="relative overflow-hidden py-20 pt-24">
                    <div
                        className="relative w-full h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                            setDragStart(e.pageX);
                            setDragOffset(0);
                        }}
                        onMouseMove={(e) => {
                            if (!isDragging) return;
                            const diff = e.pageX - dragStart;
                            // Continuous smooth scrolling
                            setDragOffset(diff);

                            // Switch products when dragged far enough
                            const threshold = 150;
                            if (diff > threshold) {
                                const overflow = diff - threshold;
                                setDragStart(e.pageX - overflow);
                                setDragOffset(overflow);
                                setTimeout(() => prevProduct(), 0);
                            } else if (diff < -threshold) {
                                const overflow = diff + threshold;
                                setDragStart(e.pageX - overflow);
                                setDragOffset(overflow);
                                setTimeout(() => nextProduct(), 0);
                            }
                        }}
                        onMouseUp={(e) => {
                            if (!isDragging) return;
                            const diff = dragOffset;
                            setIsDragging(false);

                            if (Math.abs(diff) > 60) {
                                if (diff > 0) {
                                    prevProduct();
                                } else {
                                    nextProduct();
                                }
                            }

                            setTimeout(() => setDragOffset(0), 50);
                        }}
                        onMouseLeave={() => {
                            if (isDragging) {
                                const diff = dragOffset;
                                setIsDragging(false);

                                if (Math.abs(diff) > 60) {
                                    if (diff > 0) {
                                        prevProduct();
                                    } else {
                                        nextProduct();
                                    }
                                    setTimeout(() => setDragOffset(0), 50);
                                } else {
                                    setDragOffset(0);
                                }
                            }
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* INFINITE LOOP: Render visible cards */}
                        {[...featuredProducts, ...featuredProducts, ...featuredProducts].map((product, globalIdx) => {
                            const centerPosition = featuredProducts.length;
                            const offset = globalIdx - currentIndex - centerPosition;
                            const isCenter = offset === 0;
                            const absOffset = Math.abs(offset);

                            // Only render visible cards (±2)
                            if (absOffset > 2) return null;

                            // TRANSLATEX POSITIONING - Fixed positions for smooth transitions
                            let translateX = 0;
                            let scale = 0.7;
                            let opacity = 0.4;
                            let zIndex = 30;

                            if (offset === 0) {
                                translateX = 0;
                                scale = 1.15;
                                opacity = 1;
                                zIndex = 50;
                            } else if (offset === -1) {
                                translateX = -85;
                                scale = 0.85;
                                opacity = 0.85;
                                zIndex = 40;
                            } else if (offset === 1) {
                                translateX = 85;
                                scale = 0.85;
                                opacity = 0.85;
                                zIndex = 40;
                            } else if (offset === -2) {
                                translateX = -170;
                                scale = 0.75;
                                opacity = 0.7;
                                zIndex = 30;
                            } else if (offset === 2) {
                                translateX = 170;
                                scale = 0.75;
                                opacity = 0.7;
                                zIndex = 30;
                            }

                            // DYNAMIC ZOOM DURING DRAG
                            const dragThreshold = 150;
                            const dragProgress = Math.min(Math.abs(dragOffset) / dragThreshold, 1);

                            if (dragOffset > 0) {
                                // Dragging right - cards slide left
                                if (offset === -1) {
                                    translateX = -85 + (85 * dragProgress); // -85% -> 0%
                                    scale = 0.85 + (0.30 * dragProgress); // 0.85 -> 1.15
                                    opacity = 0.85 + (0.15 * dragProgress); // 0.85 -> 1.0
                                } else if (offset === 0) {
                                    translateX = 0 + (85 * dragProgress); // 0% -> 85%
                                    scale = 1.15 - (0.30 * dragProgress); // 1.15 -> 0.85
                                    opacity = 1.0 - (0.15 * dragProgress); // 1.0 -> 0.85
                                } else if (offset === 1) {
                                    translateX = 85 + (85 * dragProgress); // 85% -> 170%
                                    scale = 0.85 - (0.10 * dragProgress); // 0.85 -> 0.75
                                    opacity = 0.85 - (0.15 * dragProgress); // 0.85 -> 0.7
                                } else if (offset === -2) {
                                    translateX = -170 + (85 * dragProgress); // -170% -> -85%
                                    scale = 0.75; // Stay at far size
                                    opacity = 0.7;
                                } else if (offset === 2) {
                                    translateX = 170 + (85 * dragProgress); // 170% -> 255% (slide out)
                                    scale = 0.75;
                                    opacity = 0.7;
                                }
                            } else if (dragOffset < 0) {
                                // Dragging left - cards slide right
                                if (offset === 1) {
                                    translateX = 85 - (85 * dragProgress); // 85% -> 0%
                                    scale = 0.85 + (0.30 * dragProgress); // 0.85 -> 1.15
                                    opacity = 0.85 + (0.15 * dragProgress); // 0.85 -> 1.0
                                } else if (offset === 0) {
                                    translateX = 0 - (85 * dragProgress); // 0% -> -85%
                                    scale = 1.15 - (0.30 * dragProgress); // 1.15 -> 0.85
                                    opacity = 1.0 - (0.15 * dragProgress); // 1.0 -> 0.85
                                } else if (offset === -1) {
                                    translateX = -85 - (85 * dragProgress); // -85% -> -170%
                                    scale = 0.85 - (0.10 * dragProgress); // 0.85 -> 0.75
                                    opacity = 0.85 - (0.15 * dragProgress); // 0.85 -> 0.7
                                } else if (offset === 2) {
                                    translateX = 170 - (85 * dragProgress); // 170% -> 85%
                                    scale = 0.75;
                                    opacity = 0.7;
                                } else if (offset === -2) {
                                    translateX = -170 - (85 * dragProgress); // -170% -> -255% (slide out)
                                    scale = 0.75;
                                    opacity = 0.7;
                                }
                            }


                            // Calculate how centered this card is (1 = fully center, 0 = side)
                            const centerProgress = 1 - Math.min(Math.abs(translateX) / 85, 1);

                            return (
                                <div
                                    key={`carousel-${product.id}-${globalIdx}`}
                                    className="absolute"
                                    style={{
                                        width: '340px',
                                        transform: `translateX(${translateX}%) scale(${scale}) translateZ(0)`,
                                        opacity: opacity,
                                        zIndex: zIndex,
                                        transition: isDragging
                                            ? 'none'
                                            : 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                        willChange: 'transform, opacity',
                                        pointerEvents: absOffset > 1 ? 'none' : 'auto'
                                    }}
                                >
                                    <div className="relative px-4">
                                        {/* Heart Sticker - Center Only - Pops out of the dome */}
                                        {isCenter && (
                                            <div
                                                className="absolute top-2 right-2 z-[60] -rotate-12"
                                                style={{
                                                    animation: 'fadeInScale 0.4s ease-out 0.4s both'
                                                }}
                                            >
                                                <button className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-white group">
                                                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}

                                        {/* UNIFIED DOME SHAPE CARD */}
                                        <div
                                            className="relative mx-auto flex flex-col overflow-hidden bg-white border-[6px] border-purple-100 shadow-2xl transition-all duration-300"
                                            style={{
                                                width: '320px',
                                                height: '520px',
                                                borderRadius: '160px 160px 40px 40px',
                                                transform: `translateY(${-20 * centerProgress}px)`, // Slight lift when centered
                                            }}
                                        >
                                            {/* Top Image Section (The Dome) */}
                                            <div
                                                className="relative h-[65%] bg-cover bg-center transition-transform duration-700"
                                                style={{
                                                    backgroundImage: `url(${product.image})`,
                                                    backgroundSize: 'cover'
                                                }}
                                            >
                                                {/* Gradient Overlay for better contrast */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                                                {/* NEW Badge - Center Only with Fade-in */}
                                                {isCenter && (
                                                    <div
                                                        className="absolute top-3 left-1/2 -translate-x-1/2 z-50"
                                                        style={{
                                                            animation: 'fadeInDown 0.5s ease-out 0.3s both'
                                                        }}
                                                    >
                                                        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-1.5 rounded-full shadow-xl font-bold text-xs tracking-wider">
                                                            NEW
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info Section - Standard White Box Bottom */}
                                            <div
                                                className="relative flex-grow bg-white pt-2 pb-6 px-6 flex flex-col items-center justify-start text-center border-t border-purple-50"
                                            >
                                                {/* Overlapping Badge: "Product Name" */}
                                                <div
                                                    className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 px-8 py-2.5 rounded-full shadow-lg font-bold text-white whitespace-nowrap transition-all duration-500"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #8E5465 0%, #5D3A44 100%)',
                                                        transform: `translateX(-50%) scale(${0.9 + (0.1 * centerProgress)})`,
                                                        boxShadow: '0 8px 20px -5px rgba(142, 84, 101, 0.4)'
                                                    }}
                                                >
                                                    {product.productName || 'سر الجمال'}
                                                </div>

                                                {/* CTA Slot - Appears only when centered */}
                                                <div
                                                    className="w-full flex justify-center transition-all duration-500 overflow-hidden"
                                                    style={{
                                                        marginTop: `${14 * centerProgress}px`,
                                                        height: `${55 * centerProgress}px`,
                                                        opacity: centerProgress,
                                                        visibility: centerProgress > 0.5 ? 'visible' : 'hidden'
                                                    }}
                                                >
                                                    {product.ctaText && (
                                                        <div
                                                            className="mt-1"
                                                            style={{
                                                                animation: isCenter ? 'fadeInUp 0.5s ease-out 0.2s both' : 'none'
                                                            }}
                                                        >
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (product.productLink) navigate(product.productLink);
                                                                }}
                                                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm px-10 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
                                                            >
                                                                {product.ctaText}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Description - Moves down based on centerProgress */}
                                                <div
                                                    dir="rtl"
                                                    className="w-full transition-all duration-500 ease-out"
                                                    style={{
                                                        transform: `translateY(${-12 + (12 * centerProgress)}px)`,
                                                        marginTop: `${8 + (40 * (1 - centerProgress))}px`,
                                                    }}
                                                >
                                                    <p className="text-[13px] md:text-[15px] font-medium text-gray-800 leading-relaxed line-clamp-3">
                                                        {product.leftText || product.rightText || 'استمتعي بجمال طبيعي وبثقة لا تضاهى مع منتجنا المصمم بعناية فائقة.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Arrows - SWAPPED */}
                    {featuredProducts.length > 1 && (
                        <>
                            <button
                                onClick={prevProduct}
                                disabled={isAnimating}
                                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-[60] w-14 h-14 md:w-16 md:h-16 bg-white/95 backdrop-blur-md rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center text-purple-600 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-purple-200/50 group"
                                aria-label="المنتج السابق"
                            >
                                <Icons.IconArrowLeft className="w-6 h-6 rotate-180 group-hover:scale-110 transition-transform" />
                            </button>

                            <button
                                onClick={nextProduct}
                                disabled={isAnimating}
                                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-[60] w-14 h-14 md:w-16 md:h-16 bg-white/95 backdrop-blur-md rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center text-purple-600 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-purple-200/50 group"
                                aria-label="المنتج التالي"
                            >
                                <Icons.IconArrowLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </button>
                        </>
                    )}
                </div>

                {/* Dots Indicator */}
                {featuredProducts.length > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {featuredProducts.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToProduct(index)}
                                className={`transition-all duration-300 rounded-full ${index === currentIndex
                                    ? 'bg-[var(--primary)] w-8 h-3'
                                    : 'bg-[var(--primary)]/30 w-3 h-3 hover:bg-[var(--primary)]/50'
                                    }`}
                                aria-label={`انتقل إلى المنتج ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) translateX(-50%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) translateX(-50%);
                    }
                }
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slide-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s ease-out forwards;
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.8s ease-out forwards;
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </section >
    );
}