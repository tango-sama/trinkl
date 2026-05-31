function ProductLandingPage() {
    const { Link } = ReactRouterDOM;
    const [quantity, setQuantity] = React.useState(1);
    const [addedToCart, setAddedToCart] = React.useState(false);
    
    // Product data
    const product = {
        id: 'vitamin-e-1000',
        title: 'فيتامين E 1000 وحدة دولية',
        subtitle: 'Piping Rock - Naturally Sourced',
        price: '15000',
        originalPrice: '18000',
        discount: '17%',
        image: './assets/products/vitamin-e-1000.jpg',
        badge: 'الأكثر مبيعاً',
        rating: 4.9,
        reviews: 128,
        inStock: true,
        deliveryTime: '1-3 أيام',
        features: [
            'مصدر طبيعي 100%',
            '120 كبسولة هلامية سريعة الذوبان',
            '671 ملغ د-ألفا توكوفيرول + توكوفيرولات مختلطة',
            'مكمل غذائي عالي الجودة'
        ],
        benefits: [
            {
                icon: '❤️',
                title: 'صحة القلب',
                description: 'يساعد في حماية الخلايا من التلف ويدعم صحة القلب والأوعية الدموية'
            },
            {
                icon: '✨',
                title: 'بشرة نضرة',
                description: 'مضاد أكسدة قوي يساعد في الحفاظ على شباب البشرة ونضارتها'
            },
            {
                icon: '🛡️',
                title: 'جهاز مناعي قوي',
                description: 'يدعم وظائف الجهاز المناعي ويساعد في محاربة الجذور الحرة'
            },
            {
                icon: '👁️',
                title: 'صحة العيون',
                description: 'يدعم صحة العيون ويحمي من التدهور المرتبط بالعمر'
            }
        ],
        specifications: [
            { label: 'العلامة التجارية', value: 'Piping Rock' },
            { label: 'التركيز', value: '1000 وحدة دولية (671 ملغ)' },
            { label: 'النوع', value: 'د-ألفا توكوفيرول + توكوفيرولات مختلطة' },
            { label: 'الكمية', value: '120 كبسولة هلامية' },
            { label: 'نوع الكبسولة', value: 'سريعة الذوبان' },
            { label: 'مصدر', value: 'طبيعي 100%' },
            { label: 'البلد المصنع', value: 'أمريكا' }
        ],
        usage: 'تناول كبسولة واحدة يومياً مع الوجبة',
        warnings: [
            'استشر الطبيب قبل الاستخدام إذا كنت حاملاً أو مرضعة',
            'لا تتجاوز الجرعة الموصى بها',
            'يحفظ بعيداً عن متناول الأطفال'
        ]
    };

    const handleAddToCart = () => {
        if (window.addToCart) {
            window.addToCart({ ...product, quantity });
        }
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    return (
        <div className="min-h-screen bg-[var(--bg-light)]">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-[var(--primary)]">الرئيسية</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-[var(--primary)]">المنتجات</Link>
                    <span>/</span>
                    <span className="text-[var(--text-dark)]">{product.title}</span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Product Image */}
                        <div className="relative">
                            {product.badge && (
                                <span className="absolute top-4 right-4 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-bold z-10">
                                    {product.badge}
                                </span>
                            )}
                            <div className="bg-gradient-to-br from-[var(--bg-beige)] to-white rounded-2xl p-8 flex items-center justify-center">
                                <img 
                                    src={product.image} 
                                    alt={product.title}
                                    className="max-w-full h-auto max-h-[500px] object-contain drop-shadow-2xl animate-float"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Vitamin+E'; }}
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col justify-center">
                            <span className="text-[var(--primary)] font-bold text-sm mb-2">{product.subtitle}</span>
                            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-dark)] mb-4">{product.title}</h1>
                            
                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-400 text-xl">
                                    {'★'.repeat(Math.floor(product.rating))}
                                    {'☆'.repeat(5 - Math.floor(product.rating))}
                                </div>
                                <span className="text-gray-500 text-sm">({product.reviews} تقييم)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl font-bold text-[var(--primary)]">{product.price} د.ج</span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">{product.originalPrice} د.ج</span>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">{product.discount} خصم</span>
                                    </>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-2 mb-6">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2 text-gray-600">
                                        <span className="text-green-500">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Delivery Info */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 bg-[var(--bg-beige)] p-3 rounded-xl">
                                <span>🚚</span>
                                <span>توصيل خلال {product.deliveryTime} - مجاني للطلبات فوق 5000 د.ج</span>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center border-2 border-[var(--border-color)] rounded-xl overflow-hidden">
                                    <button 
                                        onClick={() => handleQuantityChange(-1)}
                                        className="px-4 py-3 hover:bg-[var(--bg-beige)] transition-colors text-xl"
                                    >
                                        -
                                    </button>
                                    <span className="px-6 py-3 font-bold min-w-[60px] text-center">{quantity}</span>
                                    <button 
                                        onClick={() => handleQuantityChange(1)}
                                        className="px-4 py-3 hover:bg-[var(--bg-beige)] transition-colors text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                                <button 
                                    onClick={handleAddToCart}
                                    className={`flex-1 py-3 px-8 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                                        addedToCart 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]'
                                    }`}
                                >
                                    {addedToCart ? '✓ تمت الإضافة للسلة' : 'أضف للسلة'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-[var(--text-dark)] mb-12">فوائد المنتج</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {product.benefits.map((benefit, index) => (
                        <div key={index} className="luxury-card card-hover p-6 text-center">
                            <div className="text-4xl mb-4">{benefit.icon}</div>
                            <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                            <p className="text-gray-500 text-sm">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Specifications */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-6">مواصفات المنتج</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.specifications.map((spec, index) => (
                            <div key={index} className="flex justify-between p-4 bg-[var(--bg-beige)] rounded-xl">
                                <span className="text-gray-500">{spec.label}</span>
                                <span className="font-bold">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Usage & Warnings */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4">طريقة الاستخدام</h2>
                        <p className="text-gray-600 text-lg">{product.usage}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-3xl shadow-xl p-8 border-2 border-yellow-200">
                        <h2 className="text-2xl font-bold text-yellow-800 mb-4">تحذيرات</h2>
                        <ul className="space-y-2">
                            {product.warnings.map((warning, index) => (
                                <li key={index} className="flex items-center gap-2 text-yellow-700">
                                    <span>⚠️</span>
                                    {warning}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-3xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">اطلب الآن واحصل على توصيل مجاني!</h2>
                    <p className="text-lg mb-8 opacity-90">للطلبات فوق 5000 د.ج - توصيل سريع لجميع ولايات الجزائر</p>
                    <button
                        onClick={handleAddToCart}
                        className="btn-gold text-xl px-12 py-4"
                    >
                        أضف للسلة - {product.price} د.ج
                    </button>
                </div>
            </section>
        </div>
    );
}
