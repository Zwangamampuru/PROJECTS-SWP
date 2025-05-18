import React, { useEffect, useState } from 'react';

interface ClientData {
  name: string;
  email: string;
}

interface Booking {
  booking_id: string;
  service_type: string;
  technician_name: string;
  status: string;
  booking_date: string;
}

const styles = {
  dashboardWrapper: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#2c3e50',
    padding: '20px',
    color: 'white',
  },
  menuList: {
    listStyleType: 'none',
    padding: 0,
  },
  menuItem: {
    margin: '15px 0',
    cursor: 'pointer',
  },
  mainContent: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f5f6fa',
  },
  bookingActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  button: {
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    color: 'white',
  },
  danger: {
    backgroundColor: '#e74c3c',
  },
  secondary: {
    backgroundColor: '#f39c12',
  },
  warning: {
    backgroundColor: '#f0ad4e',
    marginLeft: '10px',
  },
};

const ClientDashboard: React.FC = () => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [clientId] = useState<string>('f1846c09-01b3-4422-a206-465b67d6c062');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/client/${clientId}`)
      .then((response) => response.json())
      .then((data: ClientData) => setClientData(data))
      .catch((error) => console.error('Error fetching client details:', error));
  }, [clientId]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/client/${clientId}/bookings`)
      .then((response) => response.json())
      .then((data: Booking[]) => setBookingHistory(data))
      .catch((error) => console.error('Error fetching booking history:', error));
  }, [clientId]);

  const handleReschedule = (bookingId: string) => {
    alert(`Reschedule clicked for booking ID: ${bookingId}`);
  };

  const handleCancel = (bookingId: string) => {
    fetch(`http://127.0.0.1:8000/client/${clientId}/bookings/${bookingId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setBookingHistory(prev => prev.filter(b => b.booking_id !== bookingId));
        alert('Booking canceled successfully!');
      })
      .catch((error) => console.error('Error canceling booking:', error));
  };

  const handleRemove = (bookingId: string) => {
    fetch(`http://127.0.0.1:8000/client/${clientId}/bookings/${bookingId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setBookingHistory(prev => prev.filter(b => b.booking_id !== bookingId));
        alert('Booking removed successfully!');
      })
      .catch((error) => console.error('Error removing booking:', error));
  };

  return (
    <div style={styles.dashboardWrapper}>
      <aside style={styles.sidebar}>
        <ul style={styles.menuList}>
          <li style={styles.menuItem}>Account</li>
          <li style={styles.menuItem}>Booking History</li>
          <li style={styles.menuItem}>Payments</li>
          <li style={styles.menuItem}>Saved Favorites</li>
          <li style={styles.menuItem}>Notifications</li>
          <li style={styles.menuItem}>Log Out</li>
        </ul>
      </aside>

      <div style={styles.mainContent}>
        <h1>Client Dashboard</h1>

        {clientData ? (
          <div>
            <h3>Name: {clientData.name}</h3>
            <h3>Email: {clientData.email}</h3>
          </div>
        ) : (
          <p>No client details available</p>
        )}

        <div>
          <h2>Booking History</h2>
          {bookingHistory.length > 0 ? (
            bookingHistory.map((booking) => (
              <div key={booking.booking_id} style={{ marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px' }}>
                <h4>Booking ID: {booking.booking_id}</h4>
                <h4>Service Type: {booking.service_type}</h4>
                <p>Technician: {booking.technician_name}</p>
                <p>Status: {booking.status}</p>
                <p>Booking Date: {booking.booking_date}</p>
                <div style={styles.bookingActions}>
                  <button
                    onClick={() => handleReschedule(booking.booking_id)}
                    style={{ ...styles.button, ...styles.secondary }}
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(booking.booking_id)}
                    style={{ ...styles.button, ...styles.danger }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRemove(booking.booking_id)}
                    style={{ ...styles.button, ...styles.warning }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No bookings found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
