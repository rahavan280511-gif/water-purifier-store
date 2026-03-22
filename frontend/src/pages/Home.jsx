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
            <section className="hero-section">
                <h1>Premium Water Purifiers</h1>
                <p>Providing the purest drinking water for your home and office.</p>
            </section>

            <div className="search-filters-container">
                <div className="search-box">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search products or brands..."
                        className="form-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="filter-controls">
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
                        className="form-input brand-select"
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
