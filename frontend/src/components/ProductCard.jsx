import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { _id, name, price, stock, category, brand, image } = product;
  
  // In a real app, images might be served from an 'uploads' folder or external URL
  const imageUrl = image ? (image.startsWith('http') ? image : `/${image}`) : 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop';

  return (
    <div className="card fade-in">
      <img src={imageUrl} alt={name} className="card-img" />
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className={`badge ${stock > 0 ? 'badge-stock' : 'badge-out'}`}>
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </span>
            <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{brand}</span>
        </div>
        <h3 className="card-title">{name}</h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>{category}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 'auto' }}>
          <Link to={`/product/${_id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>
            <span>Details</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
