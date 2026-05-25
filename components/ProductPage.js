function ProductPage() {
    const { useParams, Link } = ReactRouterDOM;
    const { id } = useParams();

    // State to hold the product (initially valid only if window.products has it)
    const [product, setProduct] = React.useState(() => {
        return window.products ? window.products.find(p => p.id === parseInt(id)) : null;
    });
    const [loading, setLoading] = React.useState(!product);
    const [activeTab, setActiveTab] = React.useState('description');
    const [stockCount, setStockCount] = React.useState(12);
    const [recentBuyers, setRecentBuyers] = React.useState(3);
    const [showStickyCTA, setShowStickyCTA] = React.useState(false);

    // Fetch product if not found locally
    React.useEffect(() => {
        const fetchProduct = async () => {
            if (product) return;

            setLoading(true);
            try {
                const foundLocally = window.products?.find(p => p.id === parseInt(id));
                if (foundLocally) {
                    setProduct(foundLocally);
                    setLoading(false);
                    return;
                }

                const productsRef = window.db ? firebase.firestore().collection('products') : null;
                if (productsRef) {
                    const snapshot = await productsRef.where('id', '==', parseInt(id)).limit(1).get();
                    if (!snapshot.empty) {
                        const productData = snapshot.docs[0].data();
                        setProduct(productData);
                    }
                }
            } catch (error) {
                console.error('[ProductPage] Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Show sticky CTA on scroll
    React.useEffect(() => {
        const handleScroll = () => {
            setShowStickyCTA(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Simulate stock decreasing
    React.useEffect(() => {
        const interval = setInterval(() => {
            setStockCount(prev => Math.max(3, prev - Math.random() > 0.7 ? 1 : 0));
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const { IconTruck, IconShieldCheck, IconMessageCircle, IconShield, IconSparkles, IconInstagram, IconFacebook, IconTikTok, IconWhatsApp, IconClock, IconPackage, IconCheck, IconStar, IconFire, IconUsers } = window.Icons || {};

    // Helper for Star Rating
    const StarRating = ({ size = 16 }) => (
        <div className="flex text-yellow-400 gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );

    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="text-2xl font-bold text-gray-600">عذراً، المنتج غير موجود</div>
                <Link to="/" className="mt-4 block text-[var(--primary)] hover:underline">العودة للرئيسية</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] to-white">
            {/* Sticky CTA Bar */}
            <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={product.image} alt="" className="w-12 h-12 object-cover rounded-lg" />
                        <div className="min-w-0">
                            <div className="font-bold text-sm truncate">{product.title}</div>
                            <div className="text-[var(--primary)] font-bold">{product.price} DA</div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => window.addToCart(product)} className="bg-[var(--primary)] hover:bg-[var(--accent)] text-white font-bold py-2 px-4 rounded-lg text-sm whitespace-nowrap transition-colors">
                            أضف للسلة
                        </button>
                        <a href={`https://wa.me/213662705830?text=${encodeURIComponent(`مرحباً، أريد طلب المنتج: ${product.title}`)}`} target="_blank" rel="noreferrer" className="bg-[#25D366] hover:bg-[#128C7E] text-white p-2 rounded-lg transition-colors">
                            <IconMessageCircle className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 animate-fade-in">
                    <Link to="/" className="hover:text-[var(--primary)] transition-colors">الرئيسية</Link>
                    <span className="text-gray-300">/</span>
                    {product.category && (
                        <>
                            <Link to={`/category/${product.category}`} className="hover:text-[var(--primary)] transition-colors">
                                {window.categories?.find(c => c.id === product.category)?.name}
                            </Link>
                            <span className="text-gray-300">/</span>
                        </>
                    )}
                    <span className="font-medium text-[var(--text-dark)] truncate max-w-[200px]">{product.title}</span>
                </nav>

                {/* Main Product Hero - Modern Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Image Section - Enhanced */}
                    <div className="relative">
                        {/* Badges */}
                        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse flex items-center gap-2">
                                <IconFire className="w-4 h-4" />
                                عرض خاص
                            </div>
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                                <IconCheck className="w-4 h-4" />
                                أصلي 100%
                            </div>
                        </div>

                        {/* Main Image Card */}
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                            <div className="h-[400px] lg:h-[500px] bg-gradient-to-br from-[#faf8f5] via-white to-[#f5ebe4] flex items-center justify-center p-8 relative group">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-5"></div>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-3 mt-4 justify-center">
                            {[product.image, product.image, product.image].map((img, i) => (
                                <div key={i} className={`w-20 h-20 rounded-xl border-2 overflow-hidden cursor-pointer transition-all hover:scale-105 ${i === 0 ? 'border-[var(--primary)]' : 'border-gray-200'}`}>
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Section - Enhanced */}
                    <div className="flex flex-col">
                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full">
                                <StarRating size={14} />
                                <span className="text-sm font-bold text-yellow-700">4.9</span>
                            </div>
                            <span className="text-sm text-gray-500">(120+ تقييم)</span>
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                متوفر الآن
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-dark)] mb-4 leading-tight">
                            {product.title}
                        </h1>

                        {/* Price Section */}
                        <div className="bg-gradient-to-r from-[var(--primary)]/10 to-transparent rounded-2xl p-6 mb-6">
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-bold text-[var(--primary)]">{product.price}</span>
                                <span className="text-xl text-gray-400 line-through">{(parseInt(product.price) * 1.3).toFixed(0)} DA</span>
                                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">وفر 23%</span>
                            </div>
                            <p className="text-gray-600 mt-2 text-sm">السعر يشمل الضرائب والتوصيل</p>
                        </div>

                        {/* Stock Urgency */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-red-600 font-bold text-sm flex items-center gap-2">
                                    <IconClock className="w-4 h-4" />
                                    الكمية محدودة!
                                </span>
                                <span className="text-red-600 font-bold">تبقى {stockCount} فقط</span>
                            </div>
                            <div className="w-full bg-red-200 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(stockCount / 20) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{recentBuyers} شخص يشاهدون هذا المنتج الآن</p>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {[
                                { icon: <IconShieldCheck className="w-5 h-5" />, text: 'منتج أصلي 100%' },
                                { icon: <IconPackage className="w-5 h-5" />, text: 'توصيل لجميع الولايات' },
                                { icon: <IconClock className="w-5 h-5" />, text: 'توصيل سريع 1-3 أيام' },
                                { icon: <IconShield className="w-5 h-5" />, text: 'ضمان استرجاع 14 يوم' }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                                    <div className="text-[var(--primary)]">{badge.icon}</div>
                                    <span className="text-sm font-medium text-gray-700">{badge.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-3 mb-6">
                            <button 
                                onClick={() => window.addToCart(product)} 
                                className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:from-[var(--accent)] hover:to-[var(--primary)] text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg relative overflow-hidden group"
                            >
                                <IconTruck className="w-6 h-6" />
                                <span>اطلب الآن - الدفع عند الاستلام</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>

                            <a
                                href={`https://wa.me/213662705830?text=${encodeURIComponent(`مرحباً، أريد طلب المنتج: ${product.title}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
                            >
                                <IconMessageCircle className="w-6 h-6" />
                                <span>اطلب عبر واتساب</span>
                            </a>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {['س', 'أ', 'ل'].map((letter, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-bold border-2 border-white">
                                        {letter}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600">
                                <span className="font-bold text-[var(--primary)]">+47</span> طلبية خلال الـ24 ساعة الماضية
                            </p>
                        </div>
                    </div>
                </div>

                {/* Benefits Section - Cards */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--text-dark)] mb-2">لماذا تختارين {product.title}؟</h2>
                        <p className="text-gray-500">اكتشفي الفرق بنفسك</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: <IconSparkles className="w-8 h-8" />, title: 'تركيبة فريدة', desc: 'مكونات طبيعية مختارة بعناية لأفضل النتائج' },
                            { icon: <IconUsers className="w-8 h-8" />, title: 'ثقة آلاف العملاء', desc: 'أكثر من 10,000 عميلة راضية عن النتائج' },
                            { icon: <IconClock className="w-8 h-8" />, title: 'نتائج سريعة', desc: 'لاحظي الفرق من الأسابيع الأولى' }
                        ].map((card, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-center group">
                                <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    {card.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                                <p className="text-gray-500 text-sm">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12">
                    <div className="flex border-b border-gray-100">
                        {['الوصف', 'الفوائد', 'كيفية الاستخدام'].map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(['description', 'benefits', 'usage'][i])}
                                className={`flex-1 py-4 px-6 font-bold text-sm transition-colors ${activeTab === ['description', 'benefits', 'usage'][i] ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] bg-[var(--primary)]/5' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <div className="p-8">
                        {activeTab === 'description' && (
                            <div className="prose prose-lg max-w-none text-gray-700">
                                <p className="mb-4">اكتشفي السر وراء إطلالة أكثر جاذبية وأنوثة. تم تطوير {product.title} بناءً على أبحاث مكثفة لتقديم أفضل النتائج بأمان تام.</p>
                                <p>تركيبتنا الفريدة تجمع بين المكونات الفعالة والمغذية التي تعمل بعمق لتحسين المظهر والملمس من أول استخدام.</p>
                            </div>
                        )}
                        {activeTab === 'benefits' && (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(Array.isArray(product.description) ? product.description : (product.description || '').split('\n'))
                                    .filter(b => b.trim() !== '')
                                    .map((benefit, idx) => (
                                        <li key={idx} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <IconCheck className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-gray-700">{benefit}</span>
                                        </li>
                                    ))}
                            </ul>
                        )}
                        {activeTab === 'usage' && (
                            <div className="bg-[var(--primary)]/5 rounded-2xl p-6">
                                <h4 className="font-bold text-lg mb-4">طريقة الاستخدام:</h4>
                                <ol className="space-y-3 text-gray-700">
                                    <li className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold">1</span>
                                        تناولي كبسولة واحدة مرتين يومياً مع الطعام
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold">2</span>
                                        اشربي كمية كافية من الماء
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold">3</span>
                                        استمري على الاستخدام لمدة شهرين للحصول على أفضل النتائج
                                    </li>
                                </ol>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-gradient-to-br from-white to-[#faf8f5] rounded-3xl shadow-xl border border-gray-100 p-8 mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-1">تجارب العملاء</h2>
                            <p className="text-gray-500 text-sm">شاهدي ما تقوله عملاؤنا عن المنتج</p>
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                            <StarRating size={14} />
                            4.9/5
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: "سارة م.", location: "الجزائر العاصمة", date: "منذ يومين", text: "صراحة منتج رائع جداً، لاحظت الفرق من أول أسبوع. التوصيل كان سريع والتعامل راقي. أنصح به بشدة!", rating: 5 },
                            { name: "أميرة ك.", location: "وهران", date: "منذ أسبوع", text: "جربت منتجات كثيرة لكن هذا الوحيد اللي عطاني نتيجة حقيقية. شكراً لكم على المصداقية.", rating: 5 },
                            { name: "ليلى ب.", location: "قسنطينة", date: "منذ 3 أسابيع", text: "المنتج أصلي والتغليف ممتاز. أحببت الرائحة والقوام، سأطلب مرة أخرى بالتأكيد.", rating: 5 }
                        ].map((review, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-lg">
                                        {review.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-[var(--text-dark)]">{review.name}</div>
                                        <div className="text-xs text-gray-500">{review.location}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <StarRating size={12} />
                                    <span className="text-xs text-gray-400">{review.date}</span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-6">الأسئلة الشائعة</h2>
                        <div className="space-y-3">
                            {[
                                { q: "كم مدة التوصيل؟", a: "يتم التوصيل عادةً خلال 1 إلى 3 أيام عمل حسب ولايتك. نغطي جميع ولايات الجزائر الـ58." },
                                { q: "كيف أستعمل المنتج؟", a: "طريقة الاستعمال مرفقة مع المنتج بالتفصيل. عموماً، يتم تناول كبسولة واحدة مرتين يومياً مع الطعام." },
                                { q: "هل هناك ضمان؟", a: "نعم، نضمن لك أن المنتج أصلي 100% ومطابق للمواصفات. في حال وجود أي مشكلة، يمكنك التواصل معنا مباشرة." },
                                { q: "هل يمكنني إرجاع المنتج؟", a: "نعم، لديك 14 يوماً لإرجاع المنتج في حال وجود عيب مصنعي أو خطأ في الطلب." },
                                { q: "هل المنتج آمن؟", a: "نعم، جميع منتجاتنا معتمدة وآمنة للاستخدام. مصنوعة من مكونات طبيعية 100% وخالية من المواد الضارة." }
                            ].map((item, i) => (
                                <details key={i} className="group bg-white rounded-xl border border-gray-100 overflow-hidden">
                                    <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-[var(--text-dark)] hover:bg-gray-50 transition-colors">
                                        {item.q}
                                        <span className="transition-transform duration-300 group-open:rotate-180">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </span>
                                    </summary>
                                    <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>

                    {/* Trust Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-2xl p-6 text-white">
                            <h3 className="font-bold text-xl mb-4">لماذا تثقي بنا؟</h3>
                            <ul className="space-y-3">
                                {['أكثر من 10,000 عميلة راضية', 'منتجات أصلية 100%', 'توصيل سريع لجميع الولايات', 'دعم فني على مدار الساعة'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <IconCheck className="w-5 h-5" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                            <h3 className="font-bold text-lg mb-4">تواصلي معنا</h3>
                            <p className="text-gray-500 text-sm mb-4">لديك سؤال؟ نحن هنا للمساعدة!</p>
                            <a href="https://wa.me/213662705830" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#128C7E] transition-colors">
                                <IconMessageCircle className="w-5 h-5" />
                                واتساب
                            </a>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-6">تابعينا على مواقع التواصل</h2>
                    <div className="flex justify-center gap-6">
                        {[
                            { icon: <IconWhatsApp className="w-8 h-8" />, href: "https://wa.me/213662705830", color: "bg-[#25D366]" },
                            { icon: <IconFacebook className="w-8 h-8" />, href: "https://www.facebook.com/desertshop.dz", color: "bg-[#1877F2]" },
                            { icon: <IconInstagram className="w-8 h-8" />, href: "https://www.instagram.com/x_desert.shop_x/", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
                            { icon: <IconTikTok className="w-8 h-8" />, href: "https://www.tiktok.com/@desertshop.online", color: "bg-black" }
                        ].map((social, i) => (
                            <a key={i} href={social.href} target="_blank" rel="noreferrer" className={`${social.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white transform hover:scale-110 transition-transform shadow-lg`}>
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
