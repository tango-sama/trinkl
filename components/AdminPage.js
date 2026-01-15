const SiteSettingsView = () => {
    const [settings, setSettings] = React.useState(window.siteSettings || {});
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (settings.id) {
                await window.db.updateDocument('site_settings', settings.id, settings);
            } else {
                const newDoc = await window.db.addDocument('site_settings', settings);
                setSettings({ ...settings, id: newDoc.id });
                window.siteSettings = { ...settings, id: newDoc.id };
            }
            alert('تم حفظ الإعدادات بنجاح. يرجى تحديث الصفحة لرؤية التغييرات في الموقع.');
            window.siteSettings = settings;
        } catch (e) {
            console.error(e);
            alert('فشل الحفظ');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[var(--text-dark)]">إعدادات الموقع</h2>
                <button onClick={() => setCurrentView('dashboard')} className="text-[var(--primary)] font-bold hover:underline flex items-center gap-2">
                    <div className="icon-arrow-right"></div>
                    <span>العودة</span>
                </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow border border-[var(--secondary)] max-w-2xl mx-auto">
                <h3 className="font-bold mb-6 text-lg border-b pb-2">صورة الهيرو (الرئيسية)</h3>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                    {/* Image Preview */}
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[var(--primary)]/20 shadow-lg flex-shrink-0 bg-gray-50 flex items-center justify-center relative group">
                        {settings.heroImage ? (
                            <img src={settings.heroImage} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-gray-400 flex flex-col items-center">
                                <span className="icon-image text-4xl mb-2"></span>
                                <span className="text-xs">لا توجد صورة</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 flex-grow w-full">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">رابط الصورة</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={settings.heroImage || ''}
                                onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                                className="border p-3 rounded-lg w-full text-left ltr outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                dir="ltr"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="file"
                                id="hero-upload"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        try {
                                            // Show loading state/preview?
                                            const url = await window.uploadImageToFirebase(file, 'site_assets');
                                            setSettings(prev => ({ ...prev, heroImage: url }));
                                        } catch (error) {
                                            alert("Upload Failed: " + error.message);
                                        }
                                    }
                                }}
                                className="hidden"
                            />
                            <label
                                htmlFor="hero-upload"
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer transition-colors text-center block w-full border border-gray-300 border-dashed"
                            >
                                <span className="icon-upload-cloud mr-2"></span>
                                رفع صورة جديدة
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-4 flex justify-end gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow transition-transform transform hover:-translate-y-1"
                    >
                        {isSaving ? 'جار الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </div>
            </div>
        </div>
    );
};

function AdminPage() {
    const [currentView, setCurrentView] = React.useState('dashboard');
    // Check if user is already logged in from previous session
    const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
        return sessionStorage.getItem('adminToken') === 'true';
    });
    const [password, setPassword] = React.useState('');
    const [products, setProducts] = React.useState(window.products || []);
    const [categories, setCategories] = React.useState(window.categories || []);

    const [categoryForm, setCategoryForm] = React.useState({ name: '', id: '', image: '' });
    const [editingCategory, setEditingCategory] = React.useState(null);

    // Filter and New Product Form State (Moved to top)
    const [productFilter, setProductFilter] = React.useState('all');
    const [newProductForm, setNewProductForm] = React.useState({ title: '', price: '', category: '', image: '', description: '' });

    // Product Inline Editing State
    const [productInlineEditId, setProductInlineEditId] = React.useState(null);
    const [productInlineEditForm, setProductInlineEditForm] = React.useState({});

    // Import State (Moved to top)
    const [isImporting, setIsImporting] = React.useState(false);
    const [importCategory, setImportCategory] = React.useState(window.categories && window.categories.length > 0 ? window.categories[0].id : 'pheromones');

    // Bulk Delete State (Promoted)
    const [selectedProducts, setSelectedProducts] = React.useState(new Set());
    const [isDeleting, setIsDeleting] = React.useState(false);

    // Filtered Products (Derived)
    const filteredProducts = productFilter === 'all'
        ? products
        : products.filter(p => p.category === productFilter);

    const toggleSelect = (id) => {
        const newSet = new Set(selectedProducts);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedProducts(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedProducts.size === filteredProducts.length) {
            setSelectedProducts(new Set());
        } else {
            setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.size === 0) return;
        if (!confirm(`هل أنت متأكد من حذف ${selectedProducts.size} منتج؟`)) return;

        setIsDeleting(true);
        try {
            const deletePromises = Array.from(selectedProducts).map(id => window.db.deleteDocument('products', id));
            await Promise.all(deletePromises);

            // Update local state
            const updated = products.filter(p => !selectedProducts.has(p.id));
            setProducts(updated);
            window.products = updated;
            setSelectedProducts(new Set());
            alert('تم الحذف بنجاح');
        } catch (error) {
            console.error(error); // Error boundary might catch this but we want to log it
            // Don't alert failure if it actually partially succeeded or just UI render failed
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStartProductInlineEdit = (product) => {
        setProductInlineEditId(product.id);
        setProductInlineEditForm({ ...product });
    };

    const handleCancelProductInlineEdit = () => {
        setProductInlineEditId(null);
        setProductInlineEditForm({});
    };

    const handleSaveProductInlineEdit = async () => {
        if (!productInlineEditForm.title || !productInlineEditForm.price) return alert('يرجى ملء كافة التفاصيل');

        try {
            // Update Firestore
            await window.db.updateDocument('products', productInlineEditId, productInlineEditForm);

            // Update Local Admin State
            const updatedProducts = products.map(p => p.id === productInlineEditId ? productInlineEditForm : p);
            setProducts(updatedProducts);

            // Update Global State
            window.products = updatedProducts;

            setProductInlineEditId(null);
            setProductInlineEditForm({});
        } catch (error) {
            alert("Error updating product");
            console.error(error);
        }
    };

    // Inline Editing State (Categories)
    const [inlineEditId, setInlineEditId] = React.useState(null);
    const [inlineEditForm, setInlineEditForm] = React.useState({});

    const handleStartInlineEdit = (category) => {
        setInlineEditId(category.id);
        setInlineEditForm({ ...category });
    };

    const handleCancelInlineEdit = () => {
        setInlineEditId(null);
        setInlineEditForm({});
    };

    const handleSaveInlineEdit = async () => {
        if (!inlineEditForm.name || !inlineEditForm.id) return alert('يرجى ملء الاسم والمعرف');

        try {
            await window.db.updateDocument('categories', inlineEditId, inlineEditForm);

            setCategories(categories.map(c => c.id === inlineEditId ? inlineEditForm : c));
            setInlineEditId(null);
            setInlineEditForm({});
            // Also reset the top form if it was open
            setEditingCategory(null);
            setCategoryForm({ name: '', id: '', image: '' });
        } catch (error) {
            alert("Error updating category");
            console.error(error);
        }
    };

    // Very simple security for demonstration
    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'tango88') {
            setIsLoggedIn(true);
            sessionStorage.setItem('adminToken', 'true');
        } else {
            alert('كلمة المرور غير صحيحة');
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setCategoryForm(category);
        // Scroll to top to see form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('هل انت متأكد من حذف هذا التصنيف؟')) {
            try {
                await window.db.deleteDocument('categories', id);
                setCategories(categories.filter(c => c.id !== id));
            } catch (error) {
                alert("Error deleting category");
            }
        }
    };

    const handleSaveCategory = async () => {
        if (!categoryForm.name || !categoryForm.id) return alert('يرجى ملء الاسم والمعرف');

        try {
            if (editingCategory) {
                await window.db.updateDocument('categories', editingCategory.id, categoryForm);
                setCategories(categories.map(c => c.id === editingCategory.id ? categoryForm : c));
                setEditingCategory(null);
            } else {
                if (categories.find(c => c.id === categoryForm.id)) return alert('هذا المعرف (ID) موجود مسبقاً');

                await window.db.addDocument('categories', categoryForm);
                setCategories([...categories, categoryForm]);
            }
            setCategoryForm({ name: '', id: '', image: '' });
        } catch (error) {
            alert("Error saving category");
            console.error(error);
        }
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setCategoryForm({ name: '', id: '', image: '' });
    };



    // Product Filter and New Product Form

    const handleAddProduct = async () => {
        if (!newProductForm.title || !newProductForm.price || !newProductForm.category) return alert('يرجى ملء جميع الحقول المطلوبة');

        const newProduct = {
            id: Date.now(), // Simple ID generation - used as Doc ID too
            ...newProductForm
        };

        try {
            await window.db.addDocument('products', newProduct);

            // Update local Admin state
            setProducts([...products, newProduct]);
            // Update global window state for the main website
            window.products = [...(window.products || []), newProduct];

            setNewProductForm({ title: '', price: '', category: '', image: '', description: '' });
            alert('تم إضافة المنتج بنجاح');
        } catch (error) {
            alert("Error adding product");
            console.error(error);
        }
    };

    const handleCSVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (isImporting) return; // Prevent double click

        // Use selected category
        const selectedCatName = window.categories.find(c => c.id === importCategory)?.name || importCategory;
        if (!confirm(`هل أنت متأكد من استيراد المنتجات من ${file.name} إلى تصنيف: ${selectedCatName}؟`)) {
            e.target.value = '';
            return;
        }

        setIsImporting(true);
        try {
            const text = await file.text();

            // Simple CSV Parser (assuming simple structure from sample)
            const lines = text.split('\n').filter(line => line.trim() !== '');
            // const headers = lines[0].split(',').map(h => h.trim());

            let successCount = 0;
            let failCount = 0;

            // Skip header
            for (let i = 1; i < lines.length; i++) {
                // New Format: Title(0), Image(1), Price(2)
                const row = lines[i].split(',');

                if (row.length < 3) continue;

                const category = importCategory; // Use selected category
                const title = row[0].trim();
                const imageUrl = row[1].trim();
                let priceStr = row[2].trim(); // "د.ج 7.000"

                // Clean price: remove non-digits
                const price = priceStr.replace(/[^0-9]/g, '');



                let finalImageUrl = imageUrl;

                // Try to upload image to Firebase Storage
                try {
                    const imgResp = await fetch(imageUrl);
                    if (imgResp.ok) {
                        const blob = await imgResp.blob();
                        const file = new File([blob], `${Date.now()}_${i}.webp`, { type: blob.type });
                        finalImageUrl = await window.uploadImageToFirebase(file, 'products');
                    }
                } catch (imgError) {
                    console.warn(`Failed to upload image for ${title}, using original link.`, imgError);
                }

                const newProduct = {
                    id: Date.now() + i,
                    title: title,
                    price: price, // Keep as string or number? Existing app uses string usually.
                    category: category,
                    image: finalImageUrl,
                    description: 'مستورد من CSV'
                };

                await window.db.addDocument('products', newProduct);

                // Update local state incrementally? Or batch at end.
                window.products.push(newProduct);
                successCount++;
            }

            // Refresh local state fully
            setProducts([...window.products]);
            alert(`تم الاستيراد بنجاح: ${successCount} منتج. فشل: ${failCount}`);

        } catch (error) {
            alert('فشل في استيراد ملف CSV');
            console.error(error);
        } finally {
            setIsImporting(false);
            const fileInput = document.getElementById('csv-upload');
            if (fileInput) fileInput.value = '';
        }
    };

    // Products Management View
    const ProductsView = () => {


        return (
            <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-[var(--text-dark)]">تعديل المنتجات</h2>
                    <div className="flex gap-4 items-center">
                        {/* Import Category Selector */}
                        <select
                            value={importCategory}
                            onChange={(e) => setImportCategory(e.target.value)}
                            className="bg-white border border-[var(--primary)] text-[var(--text-dark)] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                            {window.categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            id="csv-upload"
                            accept=".csv"
                            className="hidden"
                            onChange={handleCSVUpload}
                        />
                        <button
                            onClick={() => document.getElementById('csv-upload').click()}
                            disabled={isImporting}
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isImporting ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    <span>جاري...</span>
                                </>
                            ) : (
                                <span>استيراد CSV</span>
                            )}
                        </button>
                        <button onClick={() => setCurrentView('dashboard')} className="text-[var(--primary)] font-bold hover:underline flex items-center gap-2">
                            <div className="icon-arrow-right"></div>
                            <span>العودة</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 mb-8 border border-[var(--secondary)]">
                    <h3 className="text-lg font-bold mb-4 text-[var(--text-dark)]">إضافة منتج جديد</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="اسم المنتج"
                            value={newProductForm.title}
                            onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                            className="border p-3 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                        <input
                            type="text"
                            placeholder="السعر (DA)"
                            value={newProductForm.price}
                            onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                            className="border p-3 rounded-lg outline-none focus:border-[var(--primary)]"
                        />
                        <select
                            value={newProductForm.category}
                            onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                            className="border p-3 rounded-lg outline-none focus:border-[var(--primary)]"
                        >
                            <option value="">اختر التصنيف</option>
                            {window.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>

                        {/* Image Upload for New Product */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="رابط الصورة"
                                value={newProductForm.image}
                                onChange={e => setNewProductForm({ ...newProductForm, image: e.target.value })}
                                className="border p-3 rounded-lg outline-none focus:border-[var(--primary)] w-full mb-2"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            try {
                                                const url = await window.uploadImageToFirebase(file, 'products');
                                                setNewProductForm({ ...newProductForm, image: url });
                                            } catch (error) {
                                                alert("فشل رفع الصورة. تأكد من إعدادات Firebase");
                                                console.error(error);
                                            }
                                        }
                                    }}
                                    className="hidden"
                                    id="product-image-upload"
                                />
                                <label
                                    htmlFor="product-image-upload"
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer transition-colors text-sm font-bold flex items-center gap-2"
                                >
                                    <div className="icon-upload-cloud"></div>
                                    رفع صورة
                                </label>
                                {newProductForm.image && <span className="text-green-600 text-xs font-bold">تم اختيار الصورة</span>}
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">أذكر فوائد المنتج (اكتب كل فائدة في سطر جديد)</label>
                            <textarea
                                placeholder="الفائدة 1&#10;الفائدة 2&#10;..."
                                value={typeof newProductForm.description === 'string' ? newProductForm.description : ''}
                                onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                                className="border p-3 rounded-lg w-full h-32 outline-none focus:border-[var(--primary)]"
                            ></textarea>
                        </div>
                        <button
                            onClick={handleAddProduct}
                            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold col-span-1 md:col-span-2 transition-colors"
                        >
                            حفظ المنتج
                        </button>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl shadow border border-[var(--secondary)]">
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-[var(--text-dark)] flex items-center gap-2 text-xl">
                            تغيير السعر
                        </h3>
                        {selectedProducts.size > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                disabled={isDeleting}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded text-sm flex items-center gap-2 animate-fade-in"
                            >
                                <div className="icon-trash-2"></div>
                                <span>{isDeleting ? 'جاري الحذف...' : `حذف المحدد (${selectedProducts.size})`}</span>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-600">اختر التصنيف:</span>
                        <select
                            value={productFilter}
                            onChange={(e) => setProductFilter(e.target.value)}
                            className="border p-2 rounded-lg outline-none focus:border-[var(--primary)] bg-gray-50 text-sm"
                        >
                            <option value="all">كل المنتجات</option>
                            {window.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden border border-[var(--secondary)]">
                    <table className="w-full text-right">
                        <thead className="bg-[#fadadd]">
                            <tr>
                                <th className="p-4 text-[var(--text-dark)] w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length}
                                        onChange={toggleSelectAll}
                                        className="w-5 h-5 rounded cursor-pointer accent-[var(--primary)]"
                                    />
                                </th>
                                <th className="p-4 text-[var(--text-dark)] w-12 text-center">#</th>
                                <th className="p-4 text-[var(--text-dark)]">المنتج</th>
                                <th className="p-4 text-[var(--text-dark)]">السعر</th>
                                <th className="p-4 text-[var(--text-dark)]">التصنيف</th>
                                <th className="p-4 text-[var(--text-dark)]">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((p, index) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.has(p.id)}
                                            onChange={() => toggleSelect(p.id)}
                                            className="w-5 h-5 rounded cursor-pointer accent-[var(--primary)]"
                                        />
                                    </td>
                                    <td className="p-4 text-center text-gray-500 font-bold">{index + 1}</td>
                                    <td className="p-4 font-medium">
                                        {productInlineEditId === p.id ? (
                                            <input
                                                type="text"
                                                value={productInlineEditForm.title}
                                                onChange={(e) => setProductInlineEditForm({ ...productInlineEditForm, title: e.target.value })}
                                                className="border p-2 rounded w-full outline-none focus:border-[var(--primary)]"
                                            />
                                        ) : (
                                            p.title
                                        )}
                                    </td>
                                    <td className="p-4 text-[var(--primary)] font-bold">
                                        {productInlineEditId === p.id ? (
                                            <input
                                                type="text"
                                                value={productInlineEditForm.price}
                                                onChange={(e) => setProductInlineEditForm({ ...productInlineEditForm, price: e.target.value })}
                                                className="border p-2 rounded w-24 outline-none focus:border-[var(--primary)]"
                                            />
                                        ) : (
                                            p.price
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {productInlineEditId === p.id ? (
                                            <select
                                                value={productInlineEditForm.category}
                                                onChange={(e) => setProductInlineEditForm({ ...productInlineEditForm, category: e.target.value })}
                                                className="border p-2 rounded outline-none focus:border-[var(--primary)]"
                                            >
                                                {window.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        ) : (
                                            p.category
                                        )}
                                    </td>
                                    <td className="p-4 flex gap-3">
                                        {productInlineEditId === p.id ? (
                                            <>
                                                <button
                                                    onClick={handleSaveProductInlineEdit}
                                                    className="text-green-600 hover:text-green-800 font-bold text-sm px-3 py-1 border border-green-600 rounded hover:bg-green-50"
                                                >
                                                    حفظ
                                                </button>
                                                <button
                                                    onClick={handleCancelProductInlineEdit}
                                                    className="text-gray-500 hover:text-gray-700 font-bold text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                                                >
                                                    إلغاء
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleStartProductInlineEdit(p)}
                                                    className="text-blue-500 hover:text-blue-700 font-bold"
                                                    title="تعديل"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <div className="icon-edit-2"></div>
                                                        <span className="text-sm">تعديل</span>
                                                    </div>
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    title="حذف"
                                                    onClick={async () => {
                                                        if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                                                            try {
                                                                await window.db.deleteDocument('products', p.id);
                                                                const updated = products.filter(prod => prod.id !== p.id);
                                                                setProducts(updated);
                                                                window.products = updated;
                                                            } catch (error) {
                                                                alert("Error deleting product");
                                                                console.error(error);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <div className="icon-trash"></div>
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Categories Management View
    const CategoriesView = () => (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[var(--text-dark)]">إدارة التصنيفات</h2>
                <button onClick={() => setCurrentView('dashboard')} className="text-[var(--primary)] font-bold hover:underline flex items-center gap-2">
                    <div className="icon-arrow-right"></div>
                    <span>العودة</span>
                </button>
            </div>

            {/* Add/Edit Category Form */}
            <div className="bg-white rounded-xl shadow p-6 mb-8 border border-[var(--secondary)]">
                <h3 className="text-lg font-bold mb-4 text-[var(--text-dark)]">
                    {editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="اسم التصنيف (مثال: العناية بالشعر)"
                        value={categoryForm.name}
                        onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="border p-3 rounded-lg outline-none focus:border-[var(--primary)]"
                    />
                    <input
                        type="text"
                        placeholder="المعرف (ID - انجليزي)"
                        value={categoryForm.id}
                        onChange={e => setCategoryForm({ ...categoryForm, id: e.target.value })}
                        disabled={!!editingCategory}
                        className={`border p-3 rounded-lg outline-none focus:border-[var(--primary)] ${editingCategory ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />

                    {/* Image Input Area */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="رابط الصورة"
                            value={categoryForm.image}
                            onChange={e => setCategoryForm({ ...categoryForm, image: e.target.value })}
                            className="border p-3 rounded-lg outline-none focus:border-[var(--primary)] w-full mb-2"
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        try {
                                            // Show loading state if preferred, but for now we block alert
                                            const url = await window.uploadImageToFirebase(file, 'categories');
                                            setCategoryForm({ ...categoryForm, image: url });
                                        } catch (error) {
                                            alert("فشل رفع الصورة. تأكد من إعدادات Firebase");
                                            console.error(error);
                                        }
                                    }
                                }}
                                className="hidden"
                                id="category-image-upload"
                            />
                            <label
                                htmlFor="category-image-upload"
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer transition-colors text-sm font-bold flex items-center gap-2"
                            >
                                <div className="icon-upload-cloud"></div>
                                رفع صورة
                            </label>
                            {categoryForm.image && <span className="text-green-600 text-xs font-bold">تم اختيار الصورة</span>}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex gap-2">
                        <button
                            onClick={handleSaveCategory}
                            className={`${editingCategory ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white py-3 rounded-lg font-bold flex-1 transition-colors`}
                        >
                            {editingCategory ? 'حفظ التعديلات' : 'إضافة التصنيف'}
                        </button>
                        {editingCategory && (
                            <button
                                onClick={handleCancelEdit}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-bold px-8 transition-colors"
                            >
                                إلغاء
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden border border-[var(--secondary)]">
                <table className="w-full text-right">
                    <thead className="bg-[#fadadd]">
                        <tr>
                            <th className="p-4 text-[var(--text-dark)]">الصورة</th>
                            <th className="p-4 text-[var(--text-dark)]">اسم التصنيف</th>
                            <th className="p-4 text-[var(--text-dark)]">المعرف (ID)</th>
                            <th className="p-4 text-[var(--text-dark)]">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map(cat => (
                            <tr key={cat.id} className={`hover:bg-gray-50 transition-colors ${editingCategory?.id === cat.id ? 'bg-blue-50' : ''}`}>
                                <td className="p-4">
                                    <div
                                        className="w-12 h-12 rounded object-cover border cursor-pointer hover:opacity-80 relative overflow-hidden group"
                                        onClick={() => {
                                            // Handle image upload even in inline mode? Or just keep it as is
                                            handleEditCategory(cat);
                                            // We could reuse the file input or make a new one, but for simplicity let's stick to the top form for image changes OR trigger it here if we want full inline.
                                            // The user asked for "edit content in table", let's assume text for now, but keeping image update is fine via the existing mechanism which updates the form state.
                                            // However, now we have inlineEditId.
                                            if (inlineEditId === cat.id) {
                                                // If we are inline editing this row, maybe clicking image triggers upload for *this* row? 
                                                // Let's implement a specific handler for this if needed, or just let users use the top form for images as it's complex to fit in table.
                                                // But to fully satisfy "edit content in table", maybe we should allow it.
                                                // For now, let's focus on text inputs as requested.
                                                document.getElementById('category-image-upload').click();
                                            } else {
                                                handleStartInlineEdit(cat); // Switch to inline edit on image click too? Optional.
                                            }
                                        }}
                                        title="اضغط لتغيير الصورة"
                                    >
                                        <img src={inlineEditId === cat.id ? inlineEditForm.image : cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white text-xs">
                                            تغيير
                                        </div>
                                    </div>
                                </td>

                                <td className="p-4 font-bold">
                                    {inlineEditId === cat.id ? (
                                        <input
                                            type="text"
                                            value={inlineEditForm.name}
                                            onChange={(e) => setInlineEditForm({ ...inlineEditForm, name: e.target.value })}
                                            className="border p-2 rounded w-full outline-none focus:border-[var(--primary)] text-[var(--text-dark)]"
                                        />
                                    ) : (
                                        cat.name
                                    )}
                                </td>

                                <td className="p-4 text-gray-500 font-mono text-sm">
                                    {inlineEditId === cat.id ? (
                                        <input
                                            type="text"
                                            value={inlineEditForm.id}
                                            onChange={(e) => setInlineEditForm({ ...inlineEditForm, id: e.target.value })}
                                            className="border p-2 rounded w-full outline-none focus:border-[var(--primary)] text-sm"
                                        />
                                    ) : (
                                        cat.id
                                    )}
                                </td>

                                <td className="p-4 flex gap-3">
                                    {inlineEditId === cat.id ? (
                                        <>
                                            <button
                                                onClick={handleSaveInlineEdit}
                                                className="text-green-600 hover:text-green-800 font-bold text-sm px-3 py-1 border border-green-600 rounded hover:bg-green-50"
                                                title="حفظ"
                                            >
                                                حفظ
                                            </button>
                                            <button
                                                onClick={handleCancelInlineEdit}
                                                className="text-gray-500 hover:text-gray-700 font-bold text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                                                title="إلغاء"
                                            >
                                                إلغاء
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleStartInlineEdit(cat)}
                                                className="text-blue-500 hover:text-blue-700 font-bold"
                                                title="تعديل سريع"
                                            >
                                                <div className="flex items-center gap-1">
                                                    <div className="icon-edit-2"></div>
                                                    <span className="text-sm">تعديل</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(cat.id)}
                                                className="text-red-500 hover:text-red-700"
                                                title="حذف"
                                            >
                                                <div className="icon-trash"></div>
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Placeholders for other views
    const PlaceholderView = ({ title, icon, desc }) => (
        <div className="animate-fade-in h-[50vh] flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-between w-full mb-8">
                <h2 className="text-2xl font-bold text-[var(--text-dark)]">{title}</h2>
                <button onClick={() => setCurrentView('dashboard')} className="text-[var(--primary)] font-bold hover:underline flex items-center gap-2">
                    <div className="icon-arrow-right"></div>
                    <span>العودة</span>
                </button>
            </div>
            <div className={`${icon} text-6xl text-[var(--secondary)] mb-4`}></div>
            <p className="text-xl text-gray-500">{desc}</p>
        </div>
    );

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-light)]">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6 text-[var(--text-dark)]">تسجيل دخول المسؤول</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg mb-4 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                        placeholder="كلمة المرور"
                    />
                    <button type="submit" className="w-full bg-[var(--primary)] text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all">دخول</button>
                </form>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            {currentView === 'dashboard' && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
                    <div className="mb-12 text-center relative w-full">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-dark)] bg-white/50 px-8 py-2 rounded-full inline-block">لوحة التحكم</h1>
                        <a href="#/" className="absolute left-0 top-1/2 transform -translate-y-1/2 text-[var(--primary)] hover:underline flex items-center gap-2 text-lg">
                            <div className="icon-home"></div>
                            <span className="hidden md:inline">الرئيسية</span>
                        </a>
                    </div>

                    <div className="flex flex-col w-full max-w-md gap-4">
                        <DashboardBtn title="تعديل التصنيفات" onClick={() => setCurrentView('categories')} />
                        <DashboardBtn title="تعديل المنتجات" onClick={() => setCurrentView('products')} />
                        <DashboardBtn title="تعديل الموقع" onClick={() => setCurrentView('site')} />
                    </div>
                </div>
            )}

            {currentView === 'products' && ProductsView()}

            {currentView === 'categories' && CategoriesView()}

            {currentView === 'site' && <SiteSettingsView />}
        </div>
    );
}

// Dashboard Button Component
const DashboardBtn = ({ title, onClick, className }) => (
    <button
        onClick={onClick}
        className={`w-full text-white text-xl md:text-2xl font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all text-center mb-6 ${className || 'bg-[#8E5465] hover:bg-[#7a4655]'}`}
    >
        {title}
    </button>
);
