function ProductPage() {
    const { useParams, Link } = ReactRouterDOM;
    const { id } = useParams();
    const product = window.products.find(p => p.id === parseInt(id));
    const [activeTab, setActiveTab] = React.useState('description');

    // Icons
    const { IconTruck, IconShieldCheck, IconMessageCircle, IconShield, IconSparkles, IconInstagram, IconFacebook, IconTikTok, IconWhatsApp } = window.Icons;

    // Helper for Star Rating
    const StarRating = () => (
        <div className="flex text-yellow-400 gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
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

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="text-2xl font-bold text-gray-600">عذراً، المنتج غير موجود</div>
                <Link to="/" className="mt-4 block text-[var(--primary)] hover:underline">العودة للرئيسية</Link>
            </div>
        );
    }



    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in-up">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-[var(--primary)] transition-colors">الرئيسية</Link>
                <span>/</span>
                {product.category && (
                    <>
                        <Link to={`/category/${product.category}`} className="hover:text-[var(--primary)] transition-colors">
                            {window.categories?.find(c => c.id === product.category)?.name}
                        </Link>
                        <span>/</span>
                    </>
                )}
                <span className="font-bold text-[var(--text-dark)] line-clamp-1">{product.title}</span>
            </div>

            {/* Main Product Hero */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[var(--bg-card)] mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
                    {/* Image Section */}
                    <div className="h-96 md:h-[600px] bg-[#FAF3F3] flex items-center justify-center p-8 relative overflow-hidden group">
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md z-10 animate-pulse">
                            عرض خاص
                        </div>
                        <img
                            src={product.image}
                            alt={product.title}
                            className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-700 drop-shadow-xl"
                        />
                    </div>

                    {/* Info Section */}
                    <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                        <div className="flex items-center gap-2 mb-2">
                            <StarRating />
                            <span className="text-sm text-gray-500">(4.9/5 تقييم)</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-dark)] mb-4 leading-tight">{product.title}</h1>
                        <div className="text-3xl font-bold text-[var(--primary)] mb-6 flex items-end gap-2">
                            {product.price}
                            <span className="text-lg text-gray-400 line-through font-normal">{(parseInt(product.price) * 1.3).toFixed(0)} DA</span>
                        </div>

                        <p className="text-lg text-gray-700 leading-relaxed mb-8 border-r-4 border-[var(--secondary)] pr-4">
                            {product.subtitle} - استمتعي بجمال طبيعي وثقة لا تضاهى. منتجنا مصمم بعناية فائقة ليمنحك النتائج التي تحلمين بها في وقت قياسي.
                        </p>

                        {/* Feature Bullets */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {['مكونات طبيعية 100%', 'نتائج مضمونة', 'توصيل لباب المنزل', 'دفع آمن عند الاستلام'].map((feat, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-[var(--bg-light)]/50 p-2 rounded-lg">
                                    <CheckIcon />
                                    <span className="text-sm font-semibold text-[var(--text-dark)]">{feat}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4 mt-auto">
                            <button onClick={() => window.addToCart(product)} className="w-full bg-[var(--primary)] hover:bg-[var(--accent)] text-white font-bold py-4 px-8 rounded-xl shadow-[0_10px_20px_rgba(142,84,101,0.3)] hover:shadow-[0_15px_25px_rgba(142,84,101,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg relative overflow-hidden group">
                                <span className="relative z-10">إتمام الطلب (الدفع عند الاستلام)</span>
                                <IconTruck className="relative z-10 w-6 h-6" />
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>

                            <a
                                href={`https://wa.me/213664925052?text=${encodeURIComponent(`مرحباً، أريد طلب المنتج: ${product.title}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 text-lg"
                            >
                                <span>اطلب عبر واتساب</span>
                                <IconMessageCircle className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Right Column: Description & Details */}
                <div className="md:col-span-2 flex flex-col gap-8">

                    {/* Why Choose Us */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[var(--bg-light)] p-3 rounded-full text-[var(--primary)]">
                                <IconSparkles className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--text-dark)]">لماذا ستحبين هذا المنتج؟</h2>
                        </div>
                        <div className="prose prose-lg text-gray-700 max-w-none">
                            <p className="mb-4">
                                اكتشفي السر وراء إطلالة أكثر جاذبية وأنوثة. تم تطوير {product.title} بناءً على أبحاث مكثفة لتقديم أفضل النتائج بأمان تام.
                            </p>
                            <p className="mb-4">
                                تركيبتنا الفريدة تجمع بين {product.category === 'hair_care' ? 'الزيوت الطبيعية والفيتامينات' : 'المكونات الفعالة والمغذية'} التي تعمل بعمق لتحسين المظهر والملمس من أول استخدام.
                            </p>
                            <div className="my-6">
                                <img
                                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800"
                                    alt="Product Lifestyle"
                                    className="w-full h-64 object-cover rounded-xl shadow-md"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-dark)] mb-3">فوائد رئيسية:</h3>
                            <ul className="list-disc list-inside space-y-2 marker:text-[var(--primary)]">
                                {product.description ? (
                                    (Array.isArray(product.description) ? product.description : product.description.split('\n'))
                                        .filter(b => b.trim() !== '')
                                        .map((benefit, idx) => (
                                            <li key={idx}>{benefit}</li>
                                        ))
                                ) : (
                                    <>
                                        <li>عناية فائقة وتغذية عميقة تدوم طويلاً.</li>
                                        <li>مكونات آمنة تماماً وخالية من المواد الضارة.</li>
                                        <li>نتائج ملحوظة وسريعة أشاد بها الآلاف.</li>
                                        <li>سهل الاستخدام ويمكن إضافته لروتينك اليومي.</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-dark)]">تجارب العملاء</h2>
                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                                4.9/5 (120+ تقييم)
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {[
                                { name: "سارة م.", date: "منذ يومين", text: "صراحة منتج رائع جداً، لاحظت الفرق من أول أسبوع. التوصيل كان سريع والتعامل راقي. أنصح به بشدة!" },
                                { name: "أميرة ك.", date: "منذ أسبوع", text: "جربت منتجات كثيرة لكن هذا الوحيد اللي عطاني نتيجة حقيقية. شكراً لكم على المصداقية." },
                                { name: "ليلى ب.", date: "منذ 3 أسابيع", text: "المنتج أصلي والتغليف ممتاز. أحببت الرائحة والقوام، سأطلب مرة أخرى بالتأكيد." }
                            ].map((review, i) => (
                                <div key={i} className="bg-[var(--bg-light)]/30 p-6 rounded-xl relative">
                                    <div className="absolute top-6 left-6 opacity-10 text-[var(--primary)]">
                                        <svg height="40" width="40" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z" /></svg>
                                    </div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--primary)] font-bold">
                                            {review.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-[var(--text-dark)]">{review.name}</div>
                                            <div className="flex items-center gap-2">
                                                <StarRating />
                                                <span className="text-xs text-gray-500">{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 relative z-10">{review.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Media Identity */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-6">هويتنا على مواقع التواصل الاجتماعي</h2>
                        <div className="flex justify-center gap-6">
                            <a href="https://wa.me/213664925052" target="_blank" rel="noreferrer" className="transform hover:scale-110 transition-transform duration-300">
                                <img src="./assets/whatsapp.png" alt="WhatsApp" className="w-14 h-14 object-contain drop-shadow-md" />
                            </a>
                            <a href="https://www.facebook.com/desertshop.dz" target="_blank" rel="noreferrer" className="transform hover:scale-110 transition-transform duration-300">
                                <img src="./assets/facebook.png" alt="Facebook" className="w-14 h-14 object-contain drop-shadow-md" />
                            </a>
                            <a href="https://www.instagram.com/x_desert.shop_x/" target="_blank" rel="noreferrer" className="transform hover:scale-110 transition-transform duration-300">
                                <img src="./assets/instagram.png" alt="Instagram" className="w-14 h-14 object-contain drop-shadow-md" />
                            </a>
                            <a href="https://www.tiktok.com/@desertshop.online?lang=en-GB" target="_blank" rel="noreferrer" className="transform hover:scale-110 transition-transform duration-300">
                                <img src="./assets/tiktok.png" alt="TikTok" className="w-14 h-14 object-contain drop-shadow-md" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Left Column: FAQ & Trust */}
                <div className="flex flex-col gap-8">
                    {/* Trust Box */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--secondary)]">
                        <h3 className="font-bold text-lg mb-4 text-[var(--text-dark)] text-center">خدماتنا المميزة</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-lg text-green-600"><IconTruck /></div>
                                <div>
                                    <div className="font-bold text-sm">توصيل سريع</div>
                                    <div className="text-xs text-gray-500">لجميع الولايات (58 ولاية)</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><IconShieldCheck /></div>
                                <div>
                                    <div className="font-bold text-sm">ضمان الجودة</div>
                                    <div className="text-xs text-gray-500">منتج أصلي 100%</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><IconShield /></div>
                                <div>
                                    <div className="font-bold text-sm">دفع آمن</div>
                                    <div className="text-xs text-gray-500">الدفع عند استلام الطلبية</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 text-[var(--text-dark)]">أسئلة شائعة</h3>
                        <div className="space-y-3">
                            {[
                                { q: "كم مدة التوصيل؟", a: "يتم التوصيل عادةً خلال 1 إلى 3 أيام عمل حسب ولايتك." },
                                { q: "كيف أستعمل المنتج؟", a: "طريقة الاستعمال مرفقة مع المنتج، وهي سهلة وبسيطة." },
                                { q: "هل هناك ضمان؟", a: "نعم، نضمن لك أن المنتج أصلي ومطابق للمواصفات." },
                                { q: "هل يمكنني إرجاع المنتج؟", a: "نعم، في حال وجود عيب مصنعي أو خطأ في الطلب." }
                            ].map((item, i) => (
                                <details key={i} className="group p-3 bg-gray-50 rounded-lg open:bg-[var(--bg-light)]/20 transition-all">
                                    <summary className="flex cursor-pointer items-center justify-between font-medium text-sm text-[var(--text-dark)]">
                                        {item.q}
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" class="w-4 h-4" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-2">{item.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>

                    {/* Small Banner */}
                    <div className="rounded-2xl overflow-hidden shadow-md relative h-48 group">
                        <img
                            src="https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt="Banner"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <div className="text-white">
                                <div className="font-bold text-lg">نتائج ممتازة</div>
                                <div className="text-xs opacity-90">انضمي لأكثر من 10,000 عميلة سعيدة</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
