import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/store/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please login to add items to cart' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      await api.post('/store/cart/add_item/', {
        product_id: product.id,
        quantity: 1,
      });
      setMessage({ type: 'success', text: `${product.name} added to cart!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to add to cart',
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <p style={styles.loadingText}>Loading amazing products...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>✨</span>
          Discover Our Products
        </h1>
        <p style={styles.subtitle}>
          Find the perfect items for you from our curated collection
        </p>
      </div>

      {message.text && (
        <div
          style={{
            ...styles.message,
            background:
              message.type === 'success'
                ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                : 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
          }}
        >
          <span style={styles.messageIcon}>
            {message.type === 'success' ? '✅' : '⚠️'}
          </span>
          {message.text}
        </div>
      )}

      {products.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📦</div>
          <p style={styles.emptyText}>No products available at the moment.</p>
          <p style={styles.emptySubtext}>Check back soon for new arrivals!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '3rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  titleIcon: {
    fontSize: '3rem',
    filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '1.2rem',
    fontWeight: '400',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem',
    gap: '1rem',
  },
  spinner: {
    fontSize: '4rem',
    animation: 'spin 2s linear infinite',
  },
  loadingText: {
    fontSize: '1.3rem',
    color: '#7f8c8d',
    fontWeight: '500',
  },
  message: {
    padding: '1.2rem 1.5rem',
    borderRadius: '16px',
    marginBottom: '2rem',
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: '0 8px 20px rgba(0,0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    animation: 'slideDown 0.5s ease',
  },
  messageIcon: {
    fontSize: '1.5rem',
  },
  empty: {
    textAlign: 'center',
    padding: '5rem 2rem',
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1rem',
    filter: 'grayscale(0.3)',
  },
  emptyText: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  emptySubtext: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2.5rem',
    animation: 'fadeIn 0.6s ease',
  },
};

export default Products;