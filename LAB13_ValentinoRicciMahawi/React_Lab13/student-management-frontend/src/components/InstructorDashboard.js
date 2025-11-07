import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import authService from '../services/auth';
import api from '../services/api';

const InstructorDashboard = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    course_name: '',
    grade: '',
    semester: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gradesRes, studentsRes] = await Promise.all([
        api.get('grades/'),
        api.get('students/')
      ]);
      setGrades(gradesRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      await api.post('grades/', formData);
      setFormSuccess('Grade added successfully!');
      setFormData({
        student: '',
        course_name: '',
        grade: '',
        semester: '',
      });
      fetchData(); // Refresh data
      setTimeout(() => {
        setShowForm(false);
        setFormSuccess('');
      }, 2000);
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to add grade');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await api.delete(`grades/${id}/`);
        setGrades(grades.filter(grade => grade.id !== id));
      } catch (err) {
        alert('Failed to delete grade');
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Instructor Dashboard</h1>
          <p style={styles.subtitle}>Welcome, {user.name}</p>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : (
          <>
            <div style={styles.statsCard}>
              <h3 style={styles.statsTitle}>Overview</h3>
              <div style={styles.statsGrid}>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>Total Students</div>
                  <div style={styles.statValue}>{students.length}</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>Grades Given</div>
                  <div style={styles.statValue}>{grades.length}</div>
                </div>
              </div>
            </div>

            <div style={styles.actionsSection}>
              <button 
                onClick={() => setShowForm(!showForm)}
                style={styles.addButton}
              >
                {showForm ? 'Cancel' : '+ Add New Grade'}
              </button>
            </div>

            {showForm && (
              <div style={styles.formCard}>
                <h3 style={styles.formTitle}>Add New Grade</h3>
                
                {formError && <div style={styles.formError}>{formError}</div>}
                {formSuccess && <div style={styles.formSuccess}>{formSuccess}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Select Student *</label>
                    <select
                      name="student"
                      value={formData.student}
                      onChange={handleInputChange}
                      required
                      style={styles.select}
                    >
                      <option value="">Choose a student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.full_name} - {student.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Course Name *</label>
                    <input
                      type="text"
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleInputChange}
                      placeholder="e.g., Mathematics 101"
                      required
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Grade *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        placeholder="0-100"
                        required
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Semester *</label>
                      <input
                        type="text"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        placeholder="e.g., Fall 2024"
                        required
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <button type="submit" style={styles.submitButton}>
                    Add Grade
                  </button>
                </form>
              </div>
            )}

            <div style={styles.gradesSection}>
              <h2 style={styles.sectionTitle}>Grades I've Given</h2>
              
              {grades.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>No grades added yet.</p>
                  <p style={styles.emptyStateHint}>
                    Click "Add New Grade" to get started.
                  </p>
                </div>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Student Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Course</th>
                        <th style={styles.th}>Grade</th>
                        <th style={styles.th}>Semester</th>
                        <th style={styles.th}>Date Added</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade) => (
                        <tr key={grade.id} style={styles.tr}>
                          <td style={styles.td}>{grade.student_name}</td>
                          <td style={styles.td}>{grade.student_email}</td>
                          <td style={styles.td}>{grade.course_name}</td>
                          <td style={{...styles.td, ...styles.gradeTd}}>
                            <span style={styles.gradeBadge}>{grade.grade}</span>
                          </td>
                          <td style={styles.td}>{grade.semester}</td>
                          <td style={styles.td}>
                            {new Date(grade.created_at).toLocaleDateString()}
                          </td>
                          <td style={styles.td}>
                            <button
                              onClick={() => handleDelete(grade.id)}
                              style={styles.deleteButton}
                            >
                              Delete
                            </button>
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
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
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
    color: '#3498db',
  },
  actionsSection: {
    marginBottom: '2rem',
  },
  addButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.875rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  formError: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  formSuccess: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: '500',
    color: '#2c3e50',
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
  submitButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.875rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
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
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default InstructorDashboard;