import React from 'react';
import styles from './ManageAppointmentsPage.module.css';

// PUBLIC_INTERFACE
function ManageAppointmentsPage() {
  // Temporary demo data for various UI sections
  const upcomingAppointments = [
    {
      id: 1,
      pet: "Max",
      time: "2024-07-04 09:00",
      type: "Vet Visit",
      icon: "🩺"
    },
    {
      id: 2,
      pet: "Bella",
      time: "2024-07-05 15:30",
      type: "Grooming",
      icon: "✂️"
    }
  ];
  const appointmentHistory = [
    {
      id: 10,
      pet: "Max",
      time: "2024-06-01 10:00",
      type: "Vaccination",
      icon: "💉"
    },
    {
      id: 11,
      pet: "Bella",
      time: "2024-05-28 12:30",
      type: "Checkup",
      icon: "🩺"
    }
  ];

  // For demo, in-place SVG/emoji icons, replace as needed by real icons (react-icons or SVGs)
  const sectionIcons = {
    upcoming: "📅",
    calendar: "🗓️",
    book: "📌",
    history: "⏳",
    reminders: "⏰",
    docs: "📄",
  };

  return (
    <div className={styles.manageAppointmentsBg}>
      <div className={styles.pageHeader}>
        <span className={styles.sectionIcon}>{sectionIcons.upcoming}</span>
        <h1 className={styles.title}>Manage Appointments</h1>
      </div>

      {/* Upcoming Appointments Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.sectionIcon}>{sectionIcons.upcoming}</span>
          <h2 className={styles.cardTitle}>Upcoming</h2>
        </div>
        <ul className={styles.appointmentList}>
          {upcomingAppointments.map(item => (
            <li key={item.id} className={styles.appointmentRow}>
              <span className={styles.listIcon}>{item.icon}</span>
              <div className={styles.appointmentDetails}>
                <div>
                  <span className={styles.petName}>{item.pet}</span>
                  <span className={styles.typeTag}>{item.type}</span>
                </div>
                <div className={styles.timeText}>{item.time}</div>
              </div>
              {/* Details button (left as is), and new Manage button with green gradient */}
              <button className={styles.gradientButton}>Details</button>
              <button
                className={styles.manageGradientBtn}
                type="button"
                aria-label={`Manage appointment for ${item.pet}`}
                tabIndex={0}
              >
                Manage
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Calendar Section (Demo) */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.sectionIcon}>{sectionIcons.calendar}</span>
          <h2 className={styles.cardTitle}>Calendar</h2>
        </div>
        <div className={styles.calendarPlaceholder}>
          {/* Simulated calendar UI; integrate real calendar widget here */}
          <div className={styles.calendarDemo}>July 2024 <span role="img" aria-label="calendar">🗓️</span></div>
        </div>
      </div>

      {/* Booking Section */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.sectionIcon}>{sectionIcons.book}</span>
          <h2 className={styles.cardTitle}>Book New</h2>
        </div>
        <form className={styles.bookingForm}>
          <input type="text" className={styles.input} placeholder="Pet Name"/>
          <input type="datetime-local" className={styles.input}/>
          <select className={styles.input}>
            <option>Vet Visit</option>
            <option>Grooming</option>
            <option>Vaccination</option>
          </select>
          <button className={styles.gradientButton} type="submit">Book Appointment</button>
        </form>
      </div>

      {/* Appointment History */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.sectionIcon}>{sectionIcons.history}</span>
          <h2 className={styles.cardTitle}>History</h2>
        </div>
        <ul className={styles.appointmentList}>
          {appointmentHistory.map(item => (
            <li key={item.id} className={styles.appointmentRow}>
              <span className={styles.listIcon}>{item.icon}</span>
              <div className={styles.appointmentDetails}>
                <div>
                  <span className={styles.petName}>{item.pet}</span>
                  <span className={styles.typeTag}>{item.type}</span>
                </div>
                <div className={styles.timeText}>{item.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Reminders Section (Demo) */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.sectionIcon}>{sectionIcons.reminders}</span>
          <h2 className={styles.cardTitle}>Reminders</h2>
        </div>
        <ul className={styles.reminderList}>
          <li>
            <span className={styles.listIcon}>⏰</span>
            <span className={styles.reminderText}>Bella - Vaccination Reminder (July 6, 10:00)</span>
          </li>
        </ul>
      </div>

      {/* Documents & Notes Section (Demo) */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.sectionIcon}>{sectionIcons.docs}</span>
          <h2 className={styles.cardTitle}>Docs & Notes</h2>
        </div>
        <ul className={styles.docsList}>
          <li>
            <span className={styles.listIcon}>📄</span>
            <span className={styles.docText}>Max - Vet Visit Report.pdf</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ManageAppointmentsPage;
