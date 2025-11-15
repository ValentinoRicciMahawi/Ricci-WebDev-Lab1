import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/store/orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage({ type: 'error', text: 'Failed to load orders' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      processing: '#3498db',
      shipped: '#9b59b6',
      delivered: '#27ae60',
      cancelled: '#e74c3c',
    };
    return colors[status] || '#95a5a6';
  };

  if (loading) {
    return <div style={styles.loading}>Loading orders...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Orders</h1>

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

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <h3 style={styles.orderId}>Order #{order.id}</h3>
                  <p style={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(order.status),
                  }}
                >
                  {order.status.toUpperCase()}
                </div>
              </div>

              <div style={styles.orderBody}>
                <div style={styles.shippingAddress}>
                  <h4 style={styles.sectionTitle}>Shipping Address:</h4>
                  <p style={styles.addressText}>{order.shipping_address}</p>
                </div>

                <div style={styles.orderItems}>
                  <h4 style={styles.sectionTitle}>Items:</h4>
                  {order.items.map((item) => (
                    <div key={item.id} style={styles.orderItem}>
                      <div style={styles.itemDetails}>
                        <span style={styles.itemName}>{item.product_name}</span>
                        <span style={styles.itemQuantity}>x{item.quantity}</span>
                      </div>
                      <span style={styles.itemPrice}>
                        Rp {parseFloat(item.subtotal).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.orderFooter}>
                <span style={styles.totalLabel}>Total:</span>
                <span style={styles.totalAmount}>
                  Rp {parseFloat(order.total_price).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
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
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6',
  },
  orderId: {
    fontSize: '1.25rem',
    color: '#2c3e50',
    marginBottom: '0.25rem',
  },
  orderDate: {
    fontSize: '0.875rem',
    color: '#7f8c8d',
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.875rem',
  },
  orderBody: {
    padding: '1.5rem',
  },
  shippingAddress: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    fontWeight: '600',
  },
  addressText: {
    color: '#7f8c8d',
    lineHeight: '1.5',
  },
  orderItems: {
    marginTop: '1.5rem',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #ecf0f1',
  },
  itemDetails: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  itemName: {
    color: '#2c3e50',
  },
  itemQuantity: {
    color: '#7f8c8d',
    fontSize: '0.875rem',
  },
  itemPrice: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderTop: '2px solid #2c3e50',
  },
  totalLabel: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalAmount: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#27ae60',
  },
};

export default Orders;