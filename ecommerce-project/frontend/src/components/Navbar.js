import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🛍️</span>
          <span style={styles.logoText}>E-Commerce</span>
        </Link>
        
        <div style={styles.links}>
          <Link to="/" style={styles.link}>
            {/* <span style={styles.linkIcon}>🏠</span> */}
            <span>Products</span>
          </Link>
          
          {user ? (
            <>
              <Link to="/cart" style={styles.link}>
                <span style={styles.linkIcon}>🛒</span>
                <span>Cart</span>
              </Link>
              <Link to="/orders" style={styles.link}>
                <span style={styles.linkIcon}>📦</span>
                <span>Orders</span>
              </Link>
              <div style={styles.userSection}>
                <div style={styles.avatar}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span style={styles.username}>Hi, {user.username}</span>
              </div>
              <button onClick={handleLogout} style={styles.logoutButton}>
                <span style={styles.logoutIcon}>🚪</span>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.authLink}>
                <span>Login</span>
              </Link>
              <Link to="/register" style={styles.registerButton}>
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem 0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.8rem',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    transition: 'transform 0.3s ease',
  },
  logoIcon: {
    fontSize: '2rem',
    animation: 'bounce 2s infinite',
  },
  logoText: {
    background: 'linear-gradient(to right, #fff, #f0f0f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  linkIcon: {
    fontSize: '1.3rem',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '25px',
    backdropFilter: 'blur(10px)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  username: {
    color: 'white',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  logoutButton: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    padding: '0.7rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoutIcon: {
    fontSize: '1.1rem',
  },
  authLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '0.6rem 1.2rem',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  registerButton: {
    background: 'white',
    color: '#667eea',
    textDecoration: 'none',
    padding: '0.7rem 1.5rem',
    borderRadius: '25px',
    fontWeight: '700',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)',
  },
};

export default Navbar;