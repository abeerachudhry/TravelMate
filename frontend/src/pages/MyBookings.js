import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchMyBookings = useCallback(async () => {
    setIsLoading(true);
    setError('');
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      setError('User not logged in. Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/my-bookings/${userId}`);
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch your bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleAddTicket = () => {
    navigate('/dashboard');
  };

  const handleRemoveTicket = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setIsLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
        fetchMyBookings();
        alert('Booking cancelled successfully!');
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to cancel booking. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleModifyTicket = (bookingId) => {
    alert(`Modify booking with ID: ${bookingId}. (Feature under development)`);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f4f7f6',
      padding: '40px',
    },
    header: {
      textAlign: 'center',
      color: '#2c3e50',
      marginBottom: '40px',
      fontSize: '32px',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '30px',
    },
    actionButton: {
      padding: '12px 25px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    addButton: {
      backgroundColor: '#28a745',
      color: 'white',
    },
    removeButton: {
      backgroundColor: '#dc3545',
      color: 'white',
    },
    modifyButton: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    loading: {
      textAlign: 'center',
      fontSize: '20px',
      color: '#777',
    },
    error: {
      textAlign: 'center',
      fontSize: '20px',
      color: '#e74c3c',
    },
    noBookings: {
      textAlign: 'center',
      fontSize: '20px',
      color: '#777',
      marginTop: '50px',
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '30px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      padding: '25px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    cardTitle: {
      fontSize: '24px',
      marginBottom: '15px',
      color: '#2c3e50',
    },
    cardDetail: {
      fontSize: '16px',
      marginBottom: '8px',
      color: '#555',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '20px',
      fontWeight: 'bold',
      fontSize: '14px',
      marginTop: '15px',
      textTransform: 'capitalize',
    },
    statusConfirmed: {
      backgroundColor: '#d4edda',
      color: '#155724',
    },
    statusPending: {
      backgroundColor: '#fff3cd',
      color: '#856404',
    },
    statusCancelled: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
    },
    cardButtons: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
      justifyContent: 'flex-end',
    },
    cardButton: {
      padding: '8px 15px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: '#dc3545',
      color: 'white',
    },
    editButton: {
      backgroundColor: '#ffc107',
      color: '#212529',
    },
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return styles.statusConfirmed;
      case 'pending':
        return styles.statusPending;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return {};
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Bookings / Tickets</h1>

      <div style={styles.buttonGroup}>
        <button style={{ ...styles.actionButton, ...styles.addButton }} onClick={handleAddTicket}>
          Add New Booking
        </button>
      </div>

      {isLoading ? (
        <p style={styles.loading}>Loading your bookings...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : bookings.length === 0 ? (
        <p style={styles.noBookings}>You have no bookings yet.</p>
      ) : (
        <div style={styles.cardContainer}>
          {bookings.map((booking) => (
            <div key={booking.id} style={styles.card}>
              <div>
                <h3 style={styles.cardTitle}>
                  {booking.booking_type === 'bus' ? booking.bus_name : booking.hotel_name}
                </h3>
                <p style={styles.cardDetail}><strong>Booking ID:</strong> {booking.id}</p>
                <p style={styles.cardDetail}><strong>Type:</strong> {booking.booking_type}</p>

                {booking.booking_type === 'bus' && (
                  <>
                    <p style={styles.cardDetail}><strong>Route:</strong> {booking.route}</p>
                    <p style={styles.cardDetail}><strong>Travel Date:</strong> {new Date(booking.travel_checkin_date).toLocaleDateString()}</p>
                    <p style={styles.cardDetail}><strong>Seats:</strong> {booking.quantity}</p>
                    {booking.seat_type && <p style={styles.cardDetail}><strong>Seat Type:</strong> {booking.seat_type}</p>}
                    {booking.selected_seat_numbers && (
                      <p style={styles.cardDetail}>
                        <strong>Seat Numbers:</strong>{' '}
                        {(() => {
                          try {
                            const seats = JSON.parse(booking.selected_seat_numbers);
                            return Array.isArray(seats) ? seats.join(', ') : booking.selected_seat_numbers;
                          } catch (e) {
                            return booking.selected_seat_numbers;
                          }
                        })()}
                      </p>
                    )}
                  </>
                )}

                {booking.booking_type === 'hotel' && (
                  <>
                    <p style={styles.cardDetail}><strong>Location:</strong> {booking.location}</p>
                    <p style={styles.cardDetail}><strong>Check-in:</strong> {new Date(booking.travel_checkin_date).toLocaleDateString()}</p>
                    <p style={styles.cardDetail}><strong>Check-out:</strong> {new Date(booking.travel_checkout_date).toLocaleDateString()}</p>
                    <p style={styles.cardDetail}><strong>Rooms:</strong> {booking.quantity}</p>
                  </>
                )}

                <p style={styles.cardDetail}><strong>Total Amount:</strong> PKR {booking.total_amount}</p>
                <p style={styles.cardDetail}><strong>Booked On:</strong> {new Date(booking.booking_date).toLocaleString()}</p>
              </div>

              <span style={{ ...styles.statusBadge, ...getStatusStyle(booking.status) }}>
                {booking.status}
              </span>

              {booking.status === 'confirmed' && (
                <div style={styles.cardButtons}>
                  <button
                    style={{ ...styles.cardButton, ...styles.editButton }}
                    onClick={() => handleModifyTicket(booking.id)}
                  >
                    Modify
                  </button>
                  <button
                    style={{ ...styles.cardButton, ...styles.cancelButton }}
                    onClick={() => handleRemoveTicket(booking.id)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
