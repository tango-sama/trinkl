const FeaturedCategories = () => {
    const [categories, setCategories] = React.useState([]);
    const [catImages, setCatImages] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                // Get top 3 categories
                const allCats = await window.db.getCollection('categories');
                const topCats = allCats.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).slice(0, 3);
                setCategories(topCats);

                // For each category, get first 3 product images
                const imagesMap = {};
                for (const cat of topCats) {
                    // Try to fetch products for this category
                    // Note: We might want a specialized query here, but for now we get all and filter
                    const allProducts = await window.db.getCollection('products');
                    const catProducts = allProducts.filter(p => p.category === cat.id);
                    const displayImages = catProducts.slice(0, 3).map(p => p.image).filter(Boolean);

                    // Fallback to category image if no product images
                    if (displayImages.length === 0 && cat.image) {
                        displayImages.push(cat.image);
                    }

                    // Fill placeholders
                    while (displayImages.length < 3) {
                        displayImages.push('./assets/placeholder.png');
                    }
                    imagesMap[cat.id] = displayImages;
                }
                setCatImages(imagesMap);
            } catch (error) {
                console.error('[FeaturedCategories] Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading || categories.length === 0) return null;

    return (
        <section className="py-16 bg-[#FDF8F8]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="section-title">اكتشفي أقسامنا</h2>
                    <p className="text-gray-600 mt-4 max-w-lg mx-auto">
                        مجموعة مختارة بعناية من أفضل منتجات الجمال والعناية لتلبية كافة احتياجاتك
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map(cat => {
                        const displayImages = catImages[cat.id] || [];

                        // Prepare some dummy stats for visual appeal
                        const { sparkles: Sparkles, shield: Shield } = window.Icons || {};
                        const stats = [
                            { icon: Sparkles ? <Sparkles className="w-4 h-4" /> : <i className="lucide-sparkles text-xs"></i>, label: "أكثر مبيعاً" },
                            { icon: Shield ? <Shield className="w-4 h-4" /> : <i className="lucide-shield-check text-xs"></i>, label: "أصلي" }
                        ];

                        return (
                            <AnimatedCategoryCard
                                key={cat.id}
                                title={cat.name}
                                images={displayImages}
                                description={`تصفحي أفضل منتجات ${cat.name} المختارة بعناية لضمان أفضل النتائج.`}
                                href={`/category/${cat.id}`}
                                stats={stats}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

window.FeaturedCategories = FeaturedCategories;
