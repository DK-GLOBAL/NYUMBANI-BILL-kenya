import React, { useState, useEffect } from 'react';

export default function TenantGreeting({ tenantName = "Valued Tenant", onLogout }) {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    // 1. Calculate time-based greeting
    const hour = new Date().getHours();
    let timeGreet = 'Good morning';
    if (hour >= 12 && hour < 17) {
      timeGreet = 'Good afternoon';
    } else if (hour >= 17) {
      timeGreet = 'Good evening';
    }
    setGreeting(timeGreet);

    // Format current time display
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const handleLogoutClick = () => {
    setIsLoggedOut(true);
    // Trigger external logout handler or redirect after 2 seconds
    setTimeout(() => {
      if (onLogout) onLogout();
    }, 2000);
  };

  if (isLoggedOut) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Goodbye, {tenantName}! 👋</h2>
          <p style={styles.text}>Thank you for using Nyumbani Bill. Have a wonderful rest of your day. Securely logging out...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Time-based Greeting & Live Clock */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.greetingTitle}>{greeting}, {tenantName}!</h1>
            <p style={styles.subtitle}>Welcome back to your Nyumbani Bill portal.</p>
          </div>
          <span style={styles.clockBadge}>{currentTime}</span>
        </div>

        {/* Professional Rental Reminders & Updates */}
        <div style={styles.updateBox}>
          <h3 style={styles.updateTitle}>📢 What's New & Reminders</h3>
          <ul style={styles.updateList}>
            <li><strong>Automated M-Pesa & PesaLink:</strong> Instant rent reconciliation is now active. All payments reflect in real-time.</li>
            <li><strong>Monthly Statement:</strong> Your latest utility and rent breakdown for this billing cycle is now available for download.</li>
            <li><strong>Security Tip:</strong> Never share your OTP or password with anyone. Nyumbani Bill support will never ask for your credentials.</li>
          </ul>
        </div>

        {/* Logout Action */}
        <div style={styles.footerRow}>
          <span style={styles.statusText}>● Secure Session Active</span>
          <button onClick={handleLogoutClick} style={styles.logoutButton}>
            Log Out Safely
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline Styles (Clean, professional, and fully visible contrast)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '32px',
    maxWidth: '600px',
    width: '100%',
    border: '1px solid #e2e8f0',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  greetingTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0',
  },
  clockBadge: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  updateBox: {
    backgroundColor: '#f8fafc',
    borderLeft: '4px solid #2563eb',
    padding: '16px 20px',
    borderRadius: '0 8px 8px 0',
    marginBottom: '24px',
  },
  updateTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 10px 0',
  },
  updateList: {
    margin: '0',
    paddingLeft: '20px',
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px',
  },
  statusText: {
    fontSize: '13px',
    color: '#16a34a',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  title: {
    fontSize: '22px',
    color: '#0f172a',
    marginBottom: '12px',
  },
  text: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.5',
  },
};
