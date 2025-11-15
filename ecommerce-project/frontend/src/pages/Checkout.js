import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/store/cart/');
      if (response.data.items.length === 0) {
        navigate('/cart');
        return;
      }
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi
    if (!shippingAddress || shippingAddress.trim().length < 10) {
      setError('Shipping address must be at least 10 characters');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/store/orders/', {
        shipping_address: shippingAddress,
      });

      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.response?.data?.error || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!cart) {
    return <div style={styles.loading}>Cart is empty</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.content}>
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Shipping Information</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Shipping Address *</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                style={styles.textarea}
                placeholder="Enter your complete shipping address (street, city, postal code, etc.)"
                rows="5"
                required
              />
              <small style={styles.hint}>
                Minimum 10 characters
              </small>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitButton,
                ...(submitting ? styles.buttonDisabled : {}),
              }}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div style={styles.summarySection}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          
          <div style={styles.items}>
            {cart.items.map((item) => (
              <div key={item.id} style={styles.summaryItem}>
                <div style={styles.itemInfo}>
                  <span style={styles.itemName}>{item.product.name}</span>
                  <span style={styles.itemQuantity}>x{item.quantity}</span>
                </div>
                <span style={styles.itemPrice}>
                  Rp {parseFloat(item.subtotal).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          <div style={styles.totalSection}>
            <div style={styles.totalRow}>
              <span>Subtotal:</span>
              <span>Rp {parseFloat(cart.total_price).toLocaleString('id-ID')}</span>
            </div>
            <div style={styles.totalRow}>
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div style={{...styles.totalRow, ...styles.grandTotal}}>
              <span>Total:</span>
              <span>Rp {parseFloat(cart.total_price).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.25rem',
    color: '#7f8c8d',
  },
  error: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
  },
  formSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    color: '#2c3e50',
    fontWeight: '500',
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  hint: {
    marginTop: '0.25rem',
    color: '#7f8c8d',
    fontSize: '0.875rem',
  },
  submitButton: {
    padding: '1rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
  },
  summarySection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: 'fit-content',
    position: 'sticky',
    top: '2rem',
  },
  items: {
    marginBottom: '1.5rem',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #ecf0f1',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  itemName: {
    color: '#2c3e50',
    fontWeight: '500',
  },
  itemQuantity: {
    color: '#7f8c8d',
    fontSize: '0.875rem',
  },
  itemPrice: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  totalSection: {
    paddingTop: '1rem',
    borderTop: '2px solid #ecf0f1',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    color: '#2c3e50',
  },
  grandTotal: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginTop: '0.5rem',
    paddingTop: '1rem',
    borderTop: '2px solid #2c3e50',
  },
};

export default Checkout;