import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAward, FiBell, FiUser, FiLogOut, FiSettings, FiBookOpen, FiCalendar, FiMessageSquare, FiHome, FiClipboard, FiBarChart2 } from 'react-icons/fi';
import { getInitials } from '../../utils/helpers';

const Header = ({ userRole = 'student', userName = 'Arjun' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const colors = {
    primary: '#2563eb',
    secondary: '#3b82f6',
    softBlue: '#60a5fa',
    background: '#f0f9ff',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    lightBg: '#f8fafc'
  };

  const styles = {
    header: {
      background: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '0 30px',
      borderBottom: `1px solid ${colors.border}`
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px'
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer'
    },
    logoIcon: {
      fontSize: '32px',
      color: colors.primary,
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '700',
      color: colors.text
    },
    logoDot: {
      color: colors.primary
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: colors.textLight,
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      padding: '8px 12px',
      borderRadius: '8px',
      transition: 'all 0.2s',
      cursor: 'pointer'
    },
    activeNavItem: {
      background: colors.background,
      color: colors.primary,
      fontWeight: '600'
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    iconButton: {
      position: 'relative',
      background: colors.lightBg,
      border: `1px solid ${colors.border}`,
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: colors.textLight,
      fontSize: '18px',
      transition: 'all 0.2s'
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      background: colors.primary,
      color: 'white',
      fontSize: '10px',
      padding: '3px 6px',
      borderRadius: '10px',
      fontWeight: '600'
    },
    userMenu: {
      position: 'relative'
    },
    userButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: colors.lightBg,
      border: `1px solid ${colors.border}`,
      padding: '8px 15px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      background: colors.primary,
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px'
    },
    userName: {
      color: colors.text,
      fontWeight: '500',
      fontSize: '14px'
    },
    dropdown: {
      position: 'absolute',
      top: '50px',
      right: 0,
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      width: '200px',
      overflow: 'hidden',
      zIndex: 1000,
      border: `1px solid ${colors.border}`
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      color: colors.text,
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'all 0.2s',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left'
    },
    dropdownDivider: {
      height: '1px',
      background: colors.border,
      margin: '5px 0'
    },
    notificationsDropdown: {
      position: 'absolute',
      top: '50px',
      right: '50px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      width: '300px',
      zIndex: 1000,
      border: `1px solid ${colors.border}`
    },
    notificationHeader: {
      padding: '15px',
      borderBottom: `1px solid ${colors.border}`,
      fontWeight: '600',
      color: colors.text
    },
    notificationItem: {
      padding: '12px 15px',
      borderBottom: `1px solid ${colors.border}`,
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    notificationTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: colors.text,
      marginBottom: '4px'
    },
    notificationTime: {
      fontSize: '12px',
      color: colors.textLight
    }
  };

  // Get navigation items based on user role
  const getNavItems = () => {
    switch(userRole) {
      case 'student':
        return [
          { path: '/student/dashboard', label: 'Dashboard', icon: <FiHome size={16} /> },
          { path: '/student/my-courses', label: 'My Courses', icon: <FiBookOpen size={16} /> },
          { path: '/student/assignments', label: 'Assignments', icon: <FiClipboard size={16} /> },
          { path: '/student/grades', label: 'Grades', icon: <FiBarChart2 size={16} /> },
          { path: '/student/chat', label: 'Messages', icon: <FiMessageSquare size={16} /> },
          { path: '/student/announcements', label: 'Announcements', icon: <FiBell size={16} /> }
        ];
      case 'faculty':
        return [
          { path: '/faculty/dashboard', label: 'Dashboard', icon: <FiHome size={16} /> },
          { path: '/faculty/courses', label: 'My Courses', icon: <FiBookOpen size={16} /> },
          { path: '/faculty/create-assignment', label: 'Create', icon: <FiClipboard size={16} /> },
          { path: '/faculty/grade-assignments/1', label: 'Grade', icon: <FiBarChart2 size={16} /> },
          { path: '/faculty/timetable', label: 'Timetable', icon: <FiCalendar size={16} /> },
          { path: '/faculty/post-announcement', label: 'Announce', icon: <FiBell size={16} /> },
          { path: '/faculty/chat', label: 'Messages', icon: <FiMessageSquare size={16} /> }
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: <FiHome size={16} /> },
          { path: '/admin/verify-users', label: 'Verify Users', icon: <FiUser size={16} /> },
          { path: '/admin/users', label: 'All Users', icon: <FiUser size={16} /> },
          { path: '/admin/courses', label: 'Courses', icon: <FiBookOpen size={16} /> },
          { path: '/admin/import', label: 'Import', icon: <FiBookOpen size={16} /> },
          { path: '/admin/announcements', label: 'Announcements', icon: <FiBell size={16} /> },
          { path: '/admin/import', label: 'Import Data', icon: <FiUser size={16} /> }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const currentPath = window.location.pathname;

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoSection} onClick={() => navigate(`/${userRole}/dashboard`)}>
          <FiAward style={styles.logoIcon} />
          <span style={styles.logoText}>
            Acad<span style={styles.logoDot}>ema</span>
          </span>
        </div>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(currentPath === item.path ? styles.activeNavItem : {})
              }}
              onMouseEnter={(e) => {
                if (currentPath !== item.path) {
                  e.currentTarget.style.background = colors.lightBg;
                  e.currentTarget.style.color = colors.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== item.path) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colors.textLight;
                }
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div style={styles.rightSection}>
          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button 
              style={styles.iconButton}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FiBell />
              <span style={styles.badge}>3</span>
            </button>

            {showNotifications && (
              <div style={styles.notificationsDropdown}>
                <div style={styles.notificationHeader}>
                  Notifications
                </div>
                <div style={styles.notificationItem}>
                  <div style={styles.notificationTitle}>New assignment posted</div>
                  <div style={styles.notificationTime}>5 min ago</div>
                </div>
                <div style={styles.notificationItem}>
                  <div style={styles.notificationTitle}>Grade available for DSA</div>
                  <div style={styles.notificationTime}>1 hour ago</div>
                </div>
                <div style={styles.notificationItem}>
                  <div style={styles.notificationTitle}>Class cancelled tomorrow</div>
                  <div style={styles.notificationTime}>2 hours ago</div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div style={styles.userMenu}>
            <button 
              style={styles.userButton}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div style={styles.userAvatar}>
                {getInitials(userName)}
              </div>
              <span style={styles.userName}>{userName}</span>
            </button>

            {showDropdown && (
              <div style={styles.dropdown}>
                <button style={styles.dropdownItem}>
                  <FiUser /> Profile
                </button>
                <button style={styles.dropdownItem}>
                  <FiSettings /> Settings
                </button>
                <div style={styles.dropdownDivider}></div>
                <button 
                  style={{...styles.dropdownItem, color: colors.primary}}
                  onClick={handleLogout}
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;