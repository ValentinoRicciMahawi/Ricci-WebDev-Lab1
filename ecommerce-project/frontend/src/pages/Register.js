import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.password2) newErrors.password2 = 'Please confirm password';
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setErrors(result.errors);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.decorationLeft}></div>
      <div style={styles.decorationRight}></div>

      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.icon}>🎉</div>
        </div>

        <div style={styles.header}>
          <h2 style={styles.title}>Join Us Today!</h2>
          <p style={styles.subtitle}>Create your account and start shopping</p>
        </div>

        {errors.error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>
            {errors.error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>👤</span>
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.username ? styles.inputError : {}),
              }}
              placeholder="Choose a username"
            />
            {errors.username && (
              <span style={styles.errorText}>{errors.username}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📧</span>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
              }}
              placeholder="your.email@example.com"
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>✏️</span>
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                style={styles.input}
                placeholder="First name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>✏️</span>
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Last name"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔒</span>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {}),
              }}
              placeholder="Create a strong password"
            />
            {errors.password && (
              <span style={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔒</span>
              Confirm Password *
            </label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.password2 ? styles.inputError : {}),
              }}
              placeholder="Confirm your password"
            />
            {errors.password2 && (
              <span style={styles.errorText}>{errors.password2}</span>
            )}
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
                Creating Account...
              </>
            ) : (
              <>
                <span>Create Account</span>
                <span style={styles.buttonIcon}>🚀</span>
              </>
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <p style={styles.text}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login here →
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
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    top: '-150px',
    left: '-150px',
    filter: 'blur(70px)',
  },
  decorationRight: {
    position: 'absolute',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    bottom: '-200px',
    right: '-200px',
    filter: 'blur(90px)',
  },
  card: {
    backgroundColor: 'white',
    padding: '3rem 2.5rem',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    width: '100%',
    maxWidth: '550px',
    position: 'relative',
    zIndex: 1,
    animation: 'slideUp 0.5s ease',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  icon: {
    fontSize: '4rem',
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
  },
  errorBox: {
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
    gap: '1.3rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
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
    padding: '0.9rem 1.1rem',
    border: '2px solid #e8edf2',
    borderRadius: '12px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#f8f9fa',
  },
  inputError: {
    border: '2px solid #fcc',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#c33',
    fontSize: '0.85rem',
    marginTop: '0.4rem',
    fontWeight: '500',
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
    margin: '1.8rem 0 1.3rem',
  },
  dividerText: {
    margin: '0 auto',
    padding: '0 1rem',
    color: '#95a5a6',
    fontSize: '0.85rem',
    fontWeight: '600',
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
  },
};

export default Register;