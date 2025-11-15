import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(formData.username, formData.password);
    setLoading(false);

    if (result.success) {
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 100);
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.decorationLeft}></div>
      <div style={styles.decorationRight}></div>
      
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.icon}>🛍️</div>
        </div>
        
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back!</h2>
          <p style={styles.subtitle}>Login to continue shopping</p>
        </div>
        
        {error && (
          <div style={styles.error}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>👤</span>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your username"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔒</span>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? (
              <>
                <span style={styles.spinner}>⏳</span>
                Logging in...
              </>
            ) : (
              <>
                <span>Login</span>
                <span style={styles.buttonIcon}>→</span>
              </>
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <p style={styles.text}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Create one now →
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 100px)',
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  decorationLeft: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    top: '-100px',
    left: '-100px',
    filter: 'blur(60px)',
  },
  decorationRight: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    bottom: '-150px',
    right: '-150px',
    filter: 'blur(80px)',
  },
  card: {
    backgroundColor: 'white',
    padding: '3rem 2.5rem',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    width: '100%',
    maxWidth: '450px',
    position: 'relative',
    zIndex: 1,
    animation: 'slideUp 0.5s ease',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  icon: {
    fontSize: '4rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '0.5rem',
    fontSize: '2.2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '1.05rem',
    fontWeight: '400',
  },
  error: {
    backgroundColor: '#fee',
    border: '2px solid #fcc',
    color: '#c33',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '0.95rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  errorIcon: {
    fontSize: '1.2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.6rem',
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  labelIcon: {
    fontSize: '1.2rem',
  },
  input: {
    padding: '1rem 1.2rem',
    border: '2px solid #e8edf2',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#f8f9fa',
  },
  button: {
    padding: '1.1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  buttonIcon: {
    fontSize: '1.3rem',
    transition: 'transform 0.3s ease',
  },
  buttonDisabled: {
    background: '#95a5a6',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  spinner: {
    fontSize: '1.2rem',
    animation: 'spin 1s linear infinite',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '2rem 0 1.5rem',
  },
  dividerText: {
    margin: '0 auto',
    padding: '0 1rem',
    color: '#95a5a6',
    fontSize: '0.85rem',
    fontWeight: '600',
    background: 'white',
    position: 'relative',
  },
  text: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '0.95rem',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '700',
    transition: 'all 0.3s ease',
  },
};

export default Login;