import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/store/cart/');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setMessage({ type: 'error', text: 'Failed to load cart' });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await api.put(`/store/cart/update_item/${itemId}/`, {
        quantity: newQuantity,
      });
      fetchCart();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update quantity',
      });
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/store/cart/remove_item/${itemId}/`);
      fetchCart();
      setMessage({ type: 'success', text: 'Item removed from cart' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove item' });
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;

    try {
      await api.delete('/store/cart/clear/');
      fetchCart();
      setMessage({ type: 'success', text: 'Cart cleared' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear cart' });
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading cart...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>

      {message.text && (
        <div
          style={{
            ...styles.message,
            backgroundColor: message.type === 'success' ? '#27ae60' : '#e74c3c',
          }}
        >
          {message.text}
        </div>
      )}

      {!cart || cart.items.length === 0 ? (
        <div style={styles.empty}>
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/')} style={styles.button}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div style={styles.content}>
          <div style={styles.items}>
            {cart.items.map((item) => (
              <div key={item.id} style={styles.cartItem}>
                {item.product.image && (
                  <img
                    src={`http://127.0.0.1:8000${item.product.image}`}
                    alt={item.product.name}
                    style={styles.image}
                  />
                )}
                
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.product.name}</h3>
                  <p style={styles.itemPrice}>
                    Rp {parseFloat(item.product.price).toLocaleString('id-ID')}
                  </p>
                </div>

                <div style={styles.quantityControl}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={styles.quantityButton}
                  >
                    -
                  </button>
                  <span style={styles.quantity}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={styles.quantityButton}
                  >
                    +
                  </button>
                </div>

                <div style={styles.subtotal}>
                  <p style={styles.subtotalLabel}>Subtotal:</p>
                  <p style={styles.subtotalAmount}>
                    Rp {parseFloat(item.subtotal).toLocaleString('id-ID')}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            
            <div style={styles.summaryRow}>
              <span>Total Items:</span>
              <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>

            <div style={{...styles.summaryRow, ...styles.totalRow}}>
              <span>Total Price:</span>
              <span>Rp {parseFloat(cart.total_price).toLocaleString('id-ID')}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              style={styles.checkoutButton}
            >
              Proceed to Checkout
            </button>

            <button onClick={clearCart} style={styles.clearButton}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
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
  message: {
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#7f8c8d',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '1.125rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  itemPrice: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  quantityButton: {
    width: '32px',
    height: '32px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.125rem',
  },
  quantity: {
    minWidth: '40px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtotal: {
    textAlign: 'right',
    minWidth: '120px',
  },
  subtotalLabel: {
    fontSize: '0.875rem',
    color: '#7f8c8d',
  },
  subtotalAmount: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  summary: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: 'fit-content',
    position: 'sticky',
    top: '2rem',
  },
  summaryTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #ecf0f1',
  },
  totalRow: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: '1rem',
    borderTop: '2px solid #2c3e50',
    borderBottom: 'none',
  },
  checkoutButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '1.5rem',
  },
  clearButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'white',
    color: '#e74c3c',
    border: '2px solid #e74c3c',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '0.75rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
  },
};

export default Cart;