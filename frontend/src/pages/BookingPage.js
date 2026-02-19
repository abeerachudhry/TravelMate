import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function BookingPage() {
  const { type, id } = useParams(); // 'bus' or 'hotel', and the ID
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || {}; // Item details passed via navigation state

  const [quantity, setQuantity] = useState(1);
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState(''); // Only for hotels
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // New states for bus seat selection
  const [selectedSeatType, setSelectedSeatType] = useState('Standard'); // Default seat type
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState([]); // Array to hold selected seat numbers

  // Modal states for custom alerts
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success'); // 'success' or 'error'

  // NEW: State for Payment Method
  const [paymentMethod, setPaymentMethod] = useState(''); // Default empty or a default value

  // Hardcoded seat types for buses (for demonstration without backend changes)
  const busSeatTypes = [
    { name: 'Standard', price_modifier: 1.0 },
    { name: 'AC Comfort', price_modifier: 1.2 }, // 20% more expensive
    { name: 'Sleeper', price_modifier: 1.5 },    // 50% more expensive
  ];

  // Function to show custom modal
  const showCustomModal = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalType('success');
  };

  // Fetch item details if not passed via state (e.g., direct URL access)
  useEffect(() => {
    if (!item) {
      const fetchItemDetails = async () => {
        try {
          const endpoint = type === 'bus' ? `/api/buses/${id}` : `/api/hotels/${id}`; //
          const response = await axios.get(`http://localhost:5000${endpoint}`); //
          // In a real app, you'd set the item state here: setItem(response.data);
          showCustomModal("Item details not passed in state. For a full app, implement API to fetch by ID.", "error");
          navigate('/dashboard'); // Redirect if no item data or error fetching
        } catch (err) {
          console.error('Failed to fetch item details:', err);
          showCustomModal('Failed to load item details.', "error");
          navigate('/dashboard'); // Redirect on error
        }
      };
      // Uncomment if you add /api/buses/:id and /api/hotels/:id routes and want to fetch them
      // fetchItemDetails();
      // If item is not available, and we don't fetch, show message and redirect
      if (!item) {
        showCustomModal('Item details are missing. Please go back and select an item from the dashboard.', 'error');
        navigate('/dashboard');
      }
    }
  }, [id, type, item, navigate]);


  // Calculate total amount dynamically
  const calculateTotal = () => {
    if (!item) return 0;
    let total = 0;
    let basePrice = 0;

    if (type === 'bus') {
      basePrice = item.price_per_seat;
      const selectedType = busSeatTypes.find(t => t.name === selectedSeatType);
      const priceModifier = selectedType ? selectedType.price_modifier : 1.0;
      total = basePrice * selectedSeatNumbers.length * priceModifier; // Use selectedSeats.length for quantity
    } else if (type === 'hotel') {
      if (checkinDate && checkoutDate) {
        const start = new Date(checkinDate);
        const end = new Date(checkoutDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        total = item.price_per_night * quantity * diffDays; // quantity here refers to rooms
      }
    }
    return total;
  };

  // Handle seat selection for buses
  const handleSeatSelection = (seatNumber) => {
    if (selectedSeatNumbers.includes(seatNumber)) {
      setSelectedSeatNumbers(selectedSeatNumbers.filter(seat => seat !== seatNumber));
    } else {
      // Prevent selecting more seats than available or allowed by quantity input
      if (type === 'bus' && selectedSeatNumbers.length >= quantity) {
        showCustomModal(`You can only select up to ${quantity} seats.`, 'error');
        return;
      }
      setSelectedSeatNumbers([...selectedSeatNumbers, seatNumber]);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!item) {
      showCustomModal('Item details are missing. Please go back and select an item.', 'error');
      setIsLoading(false);
      return;
    }

    // Validation for quantity/seats
    if (type === 'bus') {
      if (selectedSeatNumbers.length === 0) {
        setError('Please select at least one seat.');
        setIsLoading(false);
        return;
      }
      if (selectedSeatNumbers.length > item.available_seats) {
        setError(`You cannot book more seats than available (${item.available_seats}).`);
        setIsLoading(false);
        return;
      }
    } else { // Hotel booking
      if (quantity <= 0) {
        setError('Quantity must be at least 1.');
        setIsLoading(false);
        return;
      }
    }


    if (type === 'bus' && (!checkinDate)) {
      setError('Please select a travel date.');
      setIsLoading(false);
      return;
    }

    if (type === 'hotel' && (!checkinDate || !checkoutDate)) {
      setError('Please select check-in and check-out dates.');
      setIsLoading(false);
      return;
    }

    if (type === 'hotel') {
        const start = new Date(checkinDate);
        const end = new Date(checkoutDate);
        if (start >= end) {
            setError('Check-out date must be after check-in date.');
            setIsLoading(false);
            return;
        }
    }

    // NEW: Validate payment method
    if (!paymentMethod) {
      setError('Please select a payment method.');
      setIsLoading(false);
      return;
    }


    const totalAmount = calculateTotal();
    // FIX: Retrieve userId from sessionStorage as seen in your screenshot
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      showCustomModal('User not logged in. Please log in first.', 'error');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    const bookingData = {
      userId: parseInt(userId), // Ensure userId is parsed to an integer
      bookingType: type,
      itemId: item.id,
      quantity: type === 'bus' ? selectedSeatNumbers.length : quantity, // Quantity is now selectedSeatNumbers.length for buses
      travelCheckinDate: checkinDate,
      travelCheckoutDate: type === 'hotel' ? checkoutDate : null,
      totalAmount: totalAmount,
      status: 'confirmed', // Or 'pending' if payment gateway is involved
      paymentMethod: paymentMethod, // Use the selected payment method
      transactionId: `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Dummy ID
      // New fields for bus bookings
      seatType: type === 'bus' ? selectedSeatType : null,
      selectedSeatNumbers: type === 'bus' ? JSON.stringify(selectedSeatNumbers) : null, // Store as JSON string
    };

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', bookingData);
      showCustomModal('Booking successful! Your booking ID is: ' + response.data.bookingId, 'success');
      navigate('/my-bookings'); // Redirect to my bookings page
    } catch (err) {
      console.error('Booking failed:', err.response ? err.response.data : err.message);
      showCustomModal(err.response?.data?.error || 'Booking failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) {
    return (
        <div style={styles.container}>
            <p style={styles.message}>Loading item details or item not found. Please select an item from the dashboard.</p>
        </div>
    );
  }

  // Generate a simple array of seat numbers for display
  const totalSeats = item.total_seats || 0;
  const seatsPerRow = 4; // Example layout
  const seatNumbers = Array.from({ length: totalSeats }, (_, i) => i + 1);

  // Define traditional CSS styles as a JavaScript object
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f7f6',
      padding: '20px',
      fontFamily: 'Arial, sans-serif', // Using a common sans-serif font
    },
    bookingBox: {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      width: '100%',
      maxWidth: '600px',
      boxSizing: 'border-box',
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '32px',
      fontSize: '32px',
      fontWeight: 'bold',
    },
    detailItem: {
      marginBottom: '16px',
      fontSize: '18px',
      color: '#555',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#444',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box',
      outline: 'none',
    },
    select: {
      width: '100%',
      padding: '12px',
      marginBottom: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      outline: 'none',
    },
    button: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '20px',
      fontWeight: 'semibold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
    },
    buttonHover: {
        backgroundColor: '#218838',
        boxShadow: '0 6px 16px rgba(40, 167, 69, 0.4)',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
    error: {
      color: '#e74c3c',
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '16px',
    },
    totalAmount: {
      textAlign: 'right',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      marginTop: '24px',
      marginBottom: '32px',
    },
    message: {
        textAlign: 'center',
        fontSize: '20px',
        color: '#777',
    },
    seatGrid: {
        display: 'grid',
        gridTemplateColumns: `repeat(${seatsPerRow}, 1fr)`,
        gap: '12px',
        marginBottom: '24px',
        maxWidth: '300px', // Constrain width for better appearance
        margin: '0 auto 24px auto', // Center the grid
    },
    seat: {
        width: '56px',
        height: '56px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '10px',
        cursor: 'pointer',
        backgroundColor: '#e0e0e0',
        transition: 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        fontWeight: 'bold',
        fontSize: '18px',
        boxSizing: 'border-box',
        color: '#333',
    },
    seatSelected: {
        backgroundColor: '#007bff',
        color: 'white',
        borderColor: '#0056b3',
        boxShadow: '0 2px 8px rgba(0, 123, 255, 0.4)',
    },
    seatOccupied: { // Currently not used by logic, but for visual representation if needed later
        backgroundColor: '#dc3545',
        color: 'white',
        cursor: 'not-allowed',
        opacity: 0.7,
        borderColor: '#c82333',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px', // Slightly more rounded
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)', // Stronger shadow
        textAlign: 'center',
        maxWidth: '450px', // Slightly wider
        width: '90%',
        boxSizing: 'border-box',
    },
    modalMessage: {
        fontSize: '20px', // Slightly larger font
        marginBottom: '25px',
        color: '#333',
        lineHeight: '1.5',
    },
    modalButton: {
        padding: '12px 25px', // Larger button
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#007bff', // Primary blue
        color: 'white',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
    },
    modalButtonHover: {
        backgroundColor: '#0056b3',
    },
    modalErrorButton: {
        backgroundColor: '#dc3545', // Red for error
    },
    modalErrorButtonHover: {
        backgroundColor: '#c82333',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bookingBox}>
        <h2 style={styles.title}>Book Your {type === 'bus' ? 'Bus Ticket' : 'Hotel Room'}</h2>

        <div style={styles.detailItem}>
          <strong>{type === 'bus' ? 'Bus Name' : 'Hotel Name'}:</strong> {item.name}
        </div>
        {type === 'bus' && (
          <>
            <div style={styles.detailItem}><strong>Route:</strong> {item.route}</div>
            <div style={styles.detailItem}><strong>Departure:</strong> {item.departure_time} - Arrival: {item.arrival_time}</div>
            <div style={styles.detailItem}><strong>Price per seat:</strong> PKR {item.price_per_seat}</div>
            <div style={styles.detailItem}><strong>Available Seats:</strong> {item.available_seats}</div>
          </>
        )}
        {type === 'hotel' && (
          <>
            <div style={styles.detailItem}><strong>Location:</strong> {item.location}</div>
            <div style={styles.detailItem}><strong>Price per night:</strong> PKR {item.price_per_night}</div>
            <div style={styles.detailItem}><strong>Available Rooms:</strong> {item.available_rooms}</div>
          </>
        )}
        <p style={styles.detailItem}>
          <strong>Description:</strong> {item.description}
        </p>

        <form onSubmit={handleBookingSubmit}>
          {error && <p style={styles.error}>{error}</p>}

          {type === 'bus' && (
            <>
              <label style={styles.label}>Seat Type:</label>
              <select
                value={selectedSeatType}
                onChange={(e) => setSelectedSeatType(e.target.value)}
                style={styles.select}
                required
              >
                {busSeatTypes.map(seatType => (
                  <option key={seatType.name} value={seatType.name}>
                    {seatType.name} (PKR {item.price_per_seat * seatType.price_modifier})
                  </option>
                ))}
              </select>

              <label style={styles.label}>Number of Seats to Select:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={item.available_seats}
                style={styles.input}
                required
              />

              <label style={styles.label}>Select Seats:</label>
              <div style={styles.seatGrid}>
                {seatNumbers.map(seatNum => (
                  <div
                    key={seatNum}
                    style={
                      selectedSeatNumbers.includes(seatNum)
                        ? { ...styles.seat, ...styles.seatSelected }
                        : styles.seat
                    }
                    onClick={() => handleSeatSelection(seatNum)}
                  >
                    {seatNum}
                  </div>
                ))}
              </div>
              <p style={styles.detailItem}>Selected Seats: {selectedSeatNumbers.length > 0 ? selectedSeatNumbers.join(', ') : 'None'}</p>
            </>
          )}

          {type === 'hotel' && (
            <>
              <label style={styles.label}>Number of Rooms:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={item.available_rooms}
                style={styles.input}
                required
              />
            </>
          )}

          <label style={styles.label}>{type === 'bus' ? 'Travel Date:' : 'Check-in Date:'}</label>
          <input
            type="date"
            value={checkinDate}
            onChange={(e) => setCheckinDate(e.target.value)}
            style={styles.input}
            min={new Date().toISOString().split('T')[0]} // Cannot book for past dates
            required
          />

          {type === 'hotel' && (
            <>
              <label style={styles.label}>Check-out Date:</label>
              <input
                type="date"
                value={checkoutDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
                style={styles.input}
                min={checkinDate || new Date().toISOString().split('T')[0]} // Check-out must be after check-in or today
                required
              />
            </>
          )}

          {/* NEW: Payment Method Selection */}
          <label style={styles.label}>Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="JazzCash">JazzCash</option>
            <option value="EasyPaisa">EasyPaisa</option>
            {/* Add more payment options as needed */}
          </select>


          <div style={styles.totalAmount}>
            Total: PKR {calculateTotal().toFixed(2)}
          </div>

          <button
            type="submit"
            style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            onMouseOver={e => !isLoading && (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={e => !isLoading && (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : `Confirm ${type === 'bus' ? 'Ticket' : 'Booking'}`}
          </button>
        </form>
      </div>

      {/* Custom Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p style={styles.modalMessage}>{modalMessage}</p>
            <button
              style={modalType === 'success' ? styles.modalButton : { ...styles.modalButton, ...styles.modalErrorButton }}
              onMouseOver={e => !isLoading && (e.currentTarget.style.backgroundColor = modalType === 'success' ? styles.modalButtonHover.backgroundColor : styles.modalErrorButtonHover.backgroundColor)}
              onMouseOut={e => !isLoading && (e.currentTarget.style.backgroundColor = modalType === 'success' ? styles.modalButton.backgroundColor : styles.modalErrorButton.backgroundColor)}
              onClick={closeModal}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingPage;