import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart, showAddToCart = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return `http://127.0.0.1:8000${imagePath}`;
    return `http://127.0.0.1:8000/media/${imagePath}`;
  };

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(0,0,0,0.15)'
          : '0 8px 16px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        {product.image ? (
          <>
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              style={styles.image}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {product.stock < 5 && product.stock > 0 && (
              <div style={styles.badge}>Only {product.stock} left!</div>
            )}
          </>
        ) : (
          <div style={styles.noImage}>
            <span style={styles.noImageIcon}>📦</span>
            <span>No Image</span>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.description}>{product.description}</p>

        <div style={styles.footer}>
          <div style={styles.priceSection}>
            <span style={styles.priceLabel}>Price</span>
            <span style={styles.price}>
              Rp {parseFloat(product.price).toLocaleString('id-ID')}
            </span>
          </div>
          <div style={styles.stockSection}>
            <span style={styles.stockIcon}>📦</span>
            <span style={styles.stock}>{product.stock}</span>
          </div>
        </div>

        {showAddToCart && product.stock > 0 ? (
          <button
            onClick={() => onAddToCart(product)}
            style={{
              ...styles.button,
              background: isHovered
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <span style={styles.buttonIcon}>🛒</span>
            <span>Add to Cart</span>
          </button>
        ) : (
          <button disabled style={{ ...styles.button, ...styles.buttonDisabled }}>
            <span>Out of Stock</span>
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: '1px solid #f0f0f0',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '240px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(245, 87, 108, 0.4)',
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: '#95a5a6',
    fontSize: '1rem',
    fontWeight: '600',
  },
  noImageIcon: {
    fontSize: '3rem',
  },
  content: {
    padding: '1.5rem',
  },
  title: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#2c3e50',
    fontWeight: '700',
    lineHeight: '1.3',
  },
  description: {
    color: '#7f8c8d',
    marginBottom: '1.2rem',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.2rem',
    padding: '1rem',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 20%)',
    borderRadius: '12px',
  },
  priceSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  priceLabel: {
    fontSize: '0.75rem',
    color: '#95a5a6',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  price: {
    fontSize: '1.4rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  stockSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  stockIcon: {
    fontSize: '1.1rem',
  },
  stock: {
    fontSize: '0.95rem',
    color: '#2c3e50',
    fontWeight: '700',
  },
  button: {
    width: '100%',
    padding: '1rem',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
  },
  buttonIcon: {
    fontSize: '1.2rem',
  },
  buttonDisabled: {
    background: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
};

export default ProductCard;