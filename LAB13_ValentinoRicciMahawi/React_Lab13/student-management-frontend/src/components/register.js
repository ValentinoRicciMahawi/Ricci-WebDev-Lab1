import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    major: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect jika sudah login
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const role = authService.getUserRole();
      if (role === 'student') {
        navigate('/student-dashboard', { replace: true });
      } else if (role === 'instructor') {
        navigate('/instructor-dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
        setError(errorMessages);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const majorOptions = [
    { value: 'artificial_intelligence_and_robotics', label: 'AIR - Artificial Intelligence & Robotics' },
    { value: 'bussines_mathematics', label: 'BM - Business Mathematics' },
    { value: 'digital_bussiness_technology', label: 'DBT - Digital Business Technology' },
    { value: 'product_design_engineering', label: 'PDE - Product Design Engineering' },
    { value: 'energy_bussiness_technology', label: 'EBT - Energy Business Technology' },
    { value: 'food_bussiness_technology', label: 'FBT - Food Business Technology' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        <p style={styles.subtitle}>Create your account</p>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && (
          <div style={styles.success}>
            Registration successful! Redirecting to login...
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@student.prasetiyamulya.ac.id"
              required
              style={styles.input}
            />
            <small style={styles.hint}>
              Use @student.prasetiyamulya.ac.id or @prasetiyamulya.ac.id
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Your Full Name"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Major *</label>
            <select
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select your major</option>
              {majorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password *</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm password"
              required
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || success}
            style={{...styles.button, ...((loading || success) ? styles.buttonDisabled : {})}}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: '2rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    whiteSpace: 'pre-line',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: '500',
    color: '#2c3e50',
    fontSize: '0.95rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: 'white',
  },
  hint: {
    color: '#7f8c8d',
    fontSize: '0.85rem',
  },
  button: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.875rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default Register;