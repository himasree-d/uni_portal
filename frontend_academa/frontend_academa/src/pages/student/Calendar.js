import React, { useState } from 'react';
import { 
  FiCalendar, FiChevronLeft, FiChevronRight, 
  FiClock, FiBookOpen, FiFileText, FiBell,
  FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Demo events data
  const events = [
    {
      id: 1,
      title: 'Binary Tree Implementation Due',
      type: 'assignment',
      course: 'Data Structures & Algorithms',
      date: '2024-03-25',
      time: '11:59 PM',
      status: 'pending',
      description: 'Submit assignment on Binary Tree Implementation'
    },
    {
      id: 2,
      title: 'SQL Query Optimization Due',
      type: 'assignment',
      course: 'Database Management Systems',
      date: '2024-03-26',
      time: '11:59 PM',
      status: 'pending',
      description: 'Submit SQL optimization assignment'
    },
    {
      id: 3,
      title: 'Network Protocol Design Due',
      type: 'assignment',
      course: 'Computer Networks',
      date: '2024-03-27',
      time: '11:59 PM',
      status: 'pending',
      description: 'Submit network protocol design'
    },
    {
      id: 4,
      title: 'Mid-Term Examination',
      type: 'exam',
      course: 'Data Structures & Algorithms',
      date: '2024-03-20',
      time: '10:00 AM - 12:00 PM',
      status: 'upcoming',
      description: 'Mid-term exam in ELT-2'
    },
    {
      id: 5,
      title: 'Project Presentation',
      type: 'event',
      course: 'Database Management Systems',
      date: '2024-03-22',
      time: '02:00 PM - 04:00 PM',
      status: 'upcoming',
      description: 'Final project presentations in ELT-6'
    },
    {
      id: 6,
      title: 'Guest Lecture: Cloud Computing',
      type: 'lecture',
      course: 'Computer Networks',
      date: '2024-03-18',
      time: '11:00 AM - 12:30 PM',
      status: 'completed',
      description: 'Guest lecture by Mr. Sundar Rajan from Google'
    },
    {
      id: 7,
      title: 'Data Structures Quiz',
      type: 'quiz',
      course: 'Data Structures & Algorithms',
      date: '2024-03-28',
      time: '09:00 AM - 10:00 AM',
      status: 'upcoming',
      description: 'Quiz on trees and graphs'
    },
    {
      id: 8,
      title: 'Operating Systems Lab Exam',
      type: 'exam',
      course: 'Operating Systems',
      date: '2024-03-30',
      time: '02:00 PM - 05:00 PM',
      status: 'upcoming',
      description: 'Lab exam in ECR-17'
    }
  ];

  // Clean Blue Palette
  const colors = {
    primary: '#2563eb',
    secondary: '#3b82f6',
    softBlue: '#60a5fa',
    lightBlue: '#93c5fd',
    background: '#f0f9ff',
    cardBg: '#ffffff',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    lightBg: '#f8fafc',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    assignment: '#3b82f6',
    exam: '#ef4444',
    lecture: '#8b5cf6',
    quiz: '#f59e0b',
    event: '#10b981'
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'assignment': return colors.assignment;
      case 'exam': return colors.exam;
      case 'lecture': return colors.lecture;
      case 'quiz': return colors.quiz;
      case 'event': return colors.event;
      default: return colors.primary;
    }
  };

  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'assignment': return <FiFileText size={14} />;
      case 'exam': return <FiBookOpen size={14} />;
      case 'lecture': return <FiCalendar size={14} />;
      case 'quiz': return <FiAlertCircle size={14} />;
      case 'event': return <FiBell size={14} />;
      default: return <FiCalendar size={14} />;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={styles.emptyDay}></div>);
    }

    // Cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateStr);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <div 
          key={day} 
          style={{
            ...styles.dayCell,
            ...(isToday ? styles.todayCell : {}),
            ...(isSelected ? styles.selectedCell : {})
          }}
          onClick={() => setSelectedDate(date)}
        >
          <span style={{
            ...styles.dayNumber,
            ...(isToday ? styles.todayNumber : {}),
            ...(isSelected ? styles.selectedNumber : {})
          }}>{day}</span>
          {dayEvents.length > 0 && (
            <div style={styles.eventIndicators}>
              {dayEvents.slice(0, 3).map((event, idx) => (
                <div 
                  key={idx} 
                  style={{
                    ...styles.eventDot,
                    backgroundColor: getEventTypeColor(event.type)
                  }}
                  title={event.title}
                />
              ))}
              {dayEvents.length > 3 && (
                <span style={styles.moreEvents}>+{dayEvents.length - 3}</span>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const styles = {
    page: {
      backgroundColor: colors.background,
      minHeight: '100vh'
    },
    container: {
      padding: '32px',
      maxWidth: '1280px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '32px'
    },
    headerTitle: {
      fontSize: '28px',
      color: colors.text,
      marginBottom: '8px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    subtitle: {
      color: colors.textLight,
      fontSize: '15px'
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '2.5fr 1.5fr',
      gap: '24px'
    },
    calendarSection: {
      background: colors.cardBg,
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: `1px solid ${colors.border}`
    },
    calendarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    monthTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: colors.text
    },
    monthNav: {
      display: 'flex',
      gap: '8px'
    },
    navButton: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: colors.lightBg,
      border: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: colors.textLight,
      transition: 'all 0.2s'
    },
    weekDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
      marginBottom: '12px'
    },
    weekDay: {
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: '600',
      color: colors.textLight,
      padding: '8px'
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px'
    },
    emptyDay: {
      aspectRatio: '1',
      padding: '8px'
    },
    dayCell: {
      aspectRatio: '1',
      padding: '8px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      border: '2px solid transparent'
    },
    todayCell: {
      background: colors.lightBg
    },
    selectedCell: {
      borderColor: colors.primary,
      background: colors.background
    },
    dayNumber: {
      fontSize: '14px',
      fontWeight: '500',
      color: colors.text,
      marginBottom: '4px'
    },
    todayNumber: {
      color: colors.primary,
      fontWeight: '600'
    },
    selectedNumber: {
      color: colors.primary,
      fontWeight: '600'
    },
    eventIndicators: {
      display: 'flex',
      gap: '3px',
      flexWrap: 'wrap',
      marginTop: '2px'
    },
    eventDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%'
    },
    moreEvents: {
      fontSize: '9px',
      color: colors.textLight,
      marginLeft: '2px'
    },
    eventsSection: {
      background: colors.cardBg,
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: `1px solid ${colors.border}`
    },
    eventsHeader: {
      marginBottom: '20px'
    },
    selectedDateTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: colors.text,
      marginBottom: '4px'
    },
    selectedDateText: {
      fontSize: '14px',
      color: colors.textLight
    },
    eventsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    eventCard: {
      padding: '16px',
      background: colors.lightBg,
      borderRadius: '16px',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.2s',
      cursor: 'pointer'
    },
    eventHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    },
    eventIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    eventTitle: {
      flex: 1,
      fontSize: '15px',
      fontWeight: '600',
      color: colors.text
    },
    eventCourse: {
      fontSize: '13px',
      color: colors.textLight,
      marginBottom: '8px',
      marginLeft: '42px'
    },
    eventTime: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: colors.textLight,
      marginLeft: '42px'
    },
    noEvents: {
      textAlign: 'center',
      padding: '40px 20px',
      color: colors.textLight
    },
    upcomingSection: {
      marginTop: '24px'
    },
    upcomingTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: colors.text,
      marginBottom: '16px'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>
            <FiCalendar style={{ color: colors.primary }} />
            Academic Calendar
          </h1>
          <p style={styles.subtitle}>Track your assignments, exams, and events</p>
        </div>

        {/* Main Grid */}
        <div style={styles.mainGrid}>
          {/* Calendar Section */}
          <div style={styles.calendarSection}>
            <div style={styles.calendarHeader}>
              <h2 style={styles.monthTitle}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div style={styles.monthNav}>
                <button 
                  style={styles.navButton}
                  onClick={prevMonth}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.background;
                    e.currentTarget.style.color = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.lightBg;
                    e.currentTarget.style.color = colors.textLight;
                  }}
                >
                  <FiChevronLeft />
                </button>
                <button 
                  style={styles.navButton}
                  onClick={nextMonth}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.background;
                    e.currentTarget.style.color = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.lightBg;
                    e.currentTarget.style.color = colors.textLight;
                  }}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>

            <div style={styles.weekDays}>
              {dayNames.map(day => (
                <div key={day} style={styles.weekDay}>{day}</div>
              ))}
            </div>

            <div style={styles.calendarGrid}>
              {renderCalendar()}
            </div>
          </div>

          {/* Events Section */}
          <div style={styles.eventsSection}>
            <div style={styles.eventsHeader}>
              <h2 style={styles.selectedDateTitle}>
                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <p style={styles.selectedDateText}>
                {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div style={styles.eventsList}>
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div 
                    key={event.id} 
                    style={styles.eventCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.15)';
                      e.currentTarget.style.borderColor = colors.softBlue;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = colors.border;
                    }}
                  >
                    <div style={styles.eventHeader}>
                      <div style={{
                        ...styles.eventIcon,
                        background: `${getEventTypeColor(event.type)}20`,
                        color: getEventTypeColor(event.type)
                      }}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      <span style={styles.eventTitle}>{event.title}</span>
                    </div>
                    <div style={styles.eventCourse}>{event.course}</div>
                    <div style={styles.eventTime}>
                      <FiClock size={12} />
                      <span>{event.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noEvents}>
                  <FiCalendar size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                  <p>No events for this day</p>
                </div>
              )}
            </div>

            {/* Upcoming Events Preview */}
            <div style={styles.upcomingSection}>
              <h3 style={styles.upcomingTitle}>Upcoming This Week</h3>
              <div style={styles.eventsList}>
                {events
                  .filter(event => {
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return eventDate >= today && eventDate <= nextWeek;
                  })
                  .slice(0, 3)
                  .map(event => (
                    <div 
                      key={event.id} 
                      style={{
                        ...styles.eventCard,
                        padding: '12px'
                      }}
                    >
                      <div style={styles.eventHeader}>
                        <div style={{
                          ...styles.eventIcon,
                          width: '24px',
                          height: '24px',
                          fontSize: '12px',
                          background: `${getEventTypeColor(event.type)}20`,
                          color: getEventTypeColor(event.type)
                        }}>
                          {getEventTypeIcon(event.type)}
                        </div>
                        <span style={{...styles.eventTitle, fontSize: '13px'}}>{event.title}</span>
                      </div>
                      <div style={styles.eventCourse}>
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;