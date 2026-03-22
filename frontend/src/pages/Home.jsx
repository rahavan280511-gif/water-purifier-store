import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import { Search, Loader2, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [brands, setBrands] = useState([]);

    // Fetch distinct brands dynamically
    useEffect(() => {
        axios.get('/api/products/brands')
            .then(res => setBrands(res.data))
            .catch(err => console.error("Brands fetch error:", err));
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const query = [];
                if (category) query.push(`category=${category}`);
                if (brand) query.push(`brand=${brand}`);

                const url = query.length > 0
    ? `/api/products/filter?${query.join('&')}`
    : '/api/products';

                const res = await axios.get(url);
                setProducts(res.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, brand]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fade-in">
            <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Premium Water Purifiers</h1>
                <p style={{ color: '#64748b', fontSize: '1.25rem' }}>Providing the purest drinking water for your home and office.</p>
            </section>

            <div className="search-filters" style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2.5rem',
                background: 'white',
                padding: '1.5rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search products or brands..."
                        className="form-input"
                        style={{ paddingLeft: '2.75rem' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="category-tabs">
                {['', 'RO Purifier', 'UV Purifier', 'Spare Part', 'Filter Cartridge'].map(cat => (
                    <button
                        key={cat}
                        className={`category-tab ${category === cat ? 'active' : ''}`}
                        onClick={() => setCategory(cat)}
                    >
                        {cat === '' ? 'All Products' : cat}
                    </button>
                ))}
            </div>

                    <select
                        className="form-input"
                        style={{ width: '160px' }}
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    >
                        <option value="">All Brands</option>
                        {brands.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)', margin: '0 auto' }} />
                    <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading pure hydration...</p>
                </div>
            ) : (
                <ProductList products={filteredProducts} />
            )}


        </div>
    );
};

export default Home;
