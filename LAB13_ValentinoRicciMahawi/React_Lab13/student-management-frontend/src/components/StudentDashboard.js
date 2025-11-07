import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import authService from '../services/auth';
import api from '../services/api';

const StudentDashboard = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await api.get('grades/');
      setGrades(response.data);
    } catch (err) {
      setError('Failed to load grades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMajorLabel = (major) => {
    const majorMap = {
      'artificial_intelligence_and_robotics': 'AIR',
      'bussines_mathematics': 'BM',
      'digital_bussiness_technology': 'DBT',
      'product_design_engineering': 'PDE',
      'energy_bussiness_technology': 'EBT',
      'food_bussiness_technology': 'FBT',
    };
    return majorMap[major] || major;
  };

  const calculateAverage = () => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + parseFloat(grade.grade), 0);
    return (sum / grades.length).toFixed(2);
  };

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Student Dashboard</h1>
          <div style={styles.userCard}>
            <h3 style={styles.userName}>{user.name}</h3>
            <p style={styles.userEmail}>{user.email}</p>
            <p style={styles.userMajor}>Major: {getMajorLabel(user.major)}</p>
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading your grades...</div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : (
          <>
            {grades.length > 0 && (
              <div style={styles.statsCard}>
                <h3 style={styles.statsTitle}>Academic Summary</h3>
                <div style={styles.statsGrid}>
                  <div style={styles.statItem}>
                    <div style={styles.statLabel}>Total Courses</div>
                    <div style={styles.statValue}>{grades.length}</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statLabel}>Average Grade</div>
                    <div style={styles.statValue}>{calculateAverage()}</div>
                  </div>
                </div>
              </div>
            )}

            <div style={styles.gradesSection}>
              <h2 style={styles.sectionTitle}>My Grades</h2>
              
              {grades.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>No grades available yet.</p>
                  <p style={styles.emptyStateHint}>
                    Your instructors will add your grades here.
                  </p>
                </div>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Course Name</th>
                        <th style={styles.th}>Grade</th>
                        <th style={styles.th}>Semester</th>
                        <th style={styles.th}>Instructor</th>
                        <th style={styles.th}>Date Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade) => (
                        <tr key={grade.id} style={styles.tr}>
                          <td style={styles.td}>{grade.course_name}</td>
                          <td style={{...styles.td, ...styles.gradeTd}}>
                            <span style={styles.gradeBadge}>{grade.grade}</span>
                          </td>
                          <td style={styles.td}>{grade.semester}</td>
                          <td style={styles.td}>{grade.instructor_name}</td>
                          <td style={styles.td}>
                            {new Date(grade.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f5f6fa',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  userCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  userName: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0',
  },
  userEmail: {
    color: '#7f8c8d',
    margin: '0 0 0.25rem 0',
  },
  userMajor: {
    color: '#3498db',
    margin: 0,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  statsTitle: {
    fontSize: '1.25rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  statItem: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#27ae60',
  },
  gradesSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#7f8c8d',
    fontSize: '1.1rem',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    textAlign: 'center',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#7f8c8d',
  },
  emptyStateHint: {
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
    fontWeight: '600',
    borderBottom: '2px solid #dee2e6',
  },
  tr: {
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    padding: '1rem',
    color: '#495057',
  },
  gradeTd: {
    fontWeight: '600',
  },
  gradeBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: '#27ae60',
    color: 'white',
    borderRadius: '20px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
  },
};

export default StudentDashboard;