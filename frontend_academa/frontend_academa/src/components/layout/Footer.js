import React from 'react';

const Footer = () => {
  const colors = {
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    lightBg: '#f8fafc'
  };

  const styles = {
    footer: {
      background: 'white',
      borderTop: `1px solid ${colors.border}`,
      padding: '24px 0',
      marginTop: 'auto'
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    logo: {
      fontSize: '18px',
      fontWeight: '700',
      color: colors.text
    },
    links: {
      display: 'flex',
      gap: '24px'
    },
    link: {
      color: colors.textLight,
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.2s',
      cursor: 'pointer'
    },
    copyright: {
      color: colors.textLight,
      fontSize: '13px'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.logo}>Academa</div>
        <div style={styles.links}>
          <span style={styles.link}>About</span>
          <span style={styles.link}>Privacy</span>
          <span style={styles.link}>Terms</span>
          <span style={styles.link}>Contact</span>
        </div>
        <div style={styles.copyright}>
          © 2024 Academa. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;