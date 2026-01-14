function ProductGrid() {
    return (
        <section id="products" className="py-16 px-4 bg-white/50">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                     <div className="inline-block bg-[var(--primary)] text-white py-3 px-10 rounded-tl-3xl rounded-br-3xl shadow-lg transform -skew-x-12">
                        <h2 className="text-2xl md:text-3xl font-bold transform skew-x-12">المنتجات الأكثر مبيعاً</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}