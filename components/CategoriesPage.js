function CategoriesPage() {
    const { Link } = ReactRouterDOM;
    const categories = window.categories || [];

    // Map categories to images (using the first product image of that category as a thumbnail)
    const getCategoryImage = (catId) => {
        const product = window.products.find(p => p.category === catId);
        return product ? product.image : "https://via.placeholder.com/400x300?text=Category";
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-8 text-center">التصنيفات</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                    <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        className="group relative h-64 rounded-xl overflow-hidden shadow-lg border border-[var(--secondary)] block"
                    >
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                        <img
                            src={getCategoryImage(cat.id)}
                            alt={cat.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                            <h2 className="text-3xl font-bold text-white drop-shadow-md">{cat.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
