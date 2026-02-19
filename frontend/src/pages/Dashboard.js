import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatBot from './ChatBot';


function Dashboard() {
  const [buses, setBuses] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [offers, setOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('buses'); // 'buses', 'hotels', 'offers', 'my-bookings'
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]); // Refetch data when activeTab changes

  const fetchData = async () => {
    if (activeTab === 'my-bookings') {
      // My Bookings will be fetched by its own component
      return;
    }
    try {
      const endpoint = {
        'buses': '/api/buses',
        'hotels': '/api/hotels',
        'offers': '/api/special-offers'
      }[activeTab];

      if (endpoint) {
        const response = await axios.get(`http://localhost:5000${endpoint}`);
        if (activeTab === 'buses') setBuses(response.data);
        else if (activeTab === 'hotels') setHotels(response.data);
        else if (activeTab === 'offers') setOffers(response.data);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      alert(`Failed to fetch ${activeTab}.`);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem('userId'); // Clear stored user ID on logout
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const handleBooking = (item, type) => {
    // Navigate to the new BookingPage, passing the item details
    navigate(`/book/${type}/${item.id}`, { state: { item } });
  };

  const styles = {
    dashboardContainer: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#222222', // Dark background for the entire dashboard
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#e74c3c', // Same orange as logout button
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 5px rgba(33, 7, 7, 0.2)',
    },
    sidebarTitle: {
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '28px',
      color: '#ecf0f1',
    },
    navItem: {
      padding: '15px',
      cursor: 'pointer',
      fontSize: '18px',
      borderLeft: '5px solid transparent',
      marginBottom: '10px',
      transition: 'background-color 0.3s, border-left-color 0.3s',
      color: '#ffffff', // Ensure nav item text is white
    },
    navItemActive: {
      backgroundColor: '#c0392b', // A slightly darker shade of the logout orange for active state
      borderLeftColor: '#ffffff', // White border for active item to stand out
      color: '#ffffff',
    },
    mainContent: {
      flexGrow: 1,
      padding: '40px',
      backgroundColor: '#333333', // Dark background for the main content area
      color: '#ffffff', // Light text color for main content
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
    },
    logoutButton: {
      backgroundColor: '#e74c3c', // This is the orange color
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s',
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '30px',
    },
    card: {
      backgroundColor: '#2b2b2b', // Darker card background, slightly lighter than mainContent
      borderRadius: '10px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.3)', // More prominent shadow for depth
      overflow: 'hidden',
      transition: 'transform 0.3s ease-in-out', // Smooth hover effect
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #444444', // Subtle border to define cards
    },
    cardHover: {
        transform: 'translateY(-5px)', // Lift effect on hover
        boxShadow: '0 12px 24px rgba(0,0,0,0.4)', // Enhanced shadow on hover
    },
    cardImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderBottom: '1px solid #444444', // Border below image
    },
    cardContent: {
      padding: '20px',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      color: '#ffffff', // Light text color for card content
    },
    cardTitle: {
      fontSize: '22px',
      marginBottom: '10px',
      color: '#e74c3c', // Use the orange for titles to make them pop
      fontWeight: 'bold',
    },
    cardText: {
      fontSize: '15px',
      color: '#cccccc', // Secondary text color
      marginBottom: '8px',
      lineHeight: '1.5',
    },
    cardDescription: {
        fontSize: '14px',
        color: '#aaaaaa', // Lighter grey for descriptions
        marginBottom: '15px',
        flexGrow: 1,
    },
    bookButton: {
      backgroundColor: '#28a745', // Kept green for "Book Now" for action clarity
      color: 'white',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '15px',
      marginTop: 'auto', // Pushes button to the bottom
      transition: 'background-color 0.3s',
      fontWeight: 'bold',
    },
    bookButtonHover: {
        backgroundColor: '#218838', // Darker green on hover
    },
    noData: {
      textAlign: 'center',
      fontSize: '20px',
      color: '#aaaaaa',
      marginTop: '50px',
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.sidebar}>
        <h1 style={styles.sidebarTitle}>TravelMate</h1>
        <div
          style={{ ...styles.navItem, ...(activeTab === 'buses' ? styles.navItemActive : {}) }}
          onClick={() => setActiveTab('buses')}
        >
          Buses
        </div>
        <div
          style={{ ...styles.navItem, ...(activeTab === 'hotels' ? styles.navItemActive : {}) }}
          onClick={() => setActiveTab('hotels')}
        >
          Hotels
        </div>
        <div
          style={{ ...styles.navItem, ...(activeTab === 'offers' ? styles.navItemActive : {}) }}
          onClick={() => setActiveTab('offers')}
        >
          Special Offers
        </div>
        <div
          style={{ ...styles.navItem, ...(activeTab === 'my-bookings' ? styles.navItemActive : {}) }}
          onClick={() => {
            setActiveTab('my-bookings');
            navigate('/my-bookings'); // Navigate to the dedicated bookings page
          }}
        >
          My Bookings
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {activeTab !== 'my-bookings' && ( // Only show cards if not on My Bookings tab
          <div style={styles.cardContainer}>
            {activeTab === 'buses' && buses.length > 0 ? (
              buses.map((bus) => (
                <div key={bus.id} style={styles.card}
                     onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
                     onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.card)}
                >
                  <img src={bus.image_url || '/assets/default_bus.jpg'} alt={bus.name} style={styles.cardImage} />
                  <div style={styles.cardContent}>
                    <h3 style={styles.cardTitle}>{bus.name}</h3>
                    <p style={styles.cardText}>Route: {bus.route}</p>
                    <p style={styles.cardText}>Departure: {bus.departure_time} - Arrival: {bus.arrival_time}</p>
                    <p style={styles.cardText}>Price per seat: PKR {bus.price_per_seat}</p>
                    <p style={styles.cardText}>Available Seats: {bus.available_seats}/{bus.total_seats}</p>
                    <p style={styles.cardDescription}>{bus.description}</p>
                    <button
                      style={styles.bookButton}
                      onClick={() => handleBooking(bus, 'bus')}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.bookButtonHover)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.bookButton)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : activeTab === 'buses' && (
              <p style={styles.noData}>No bus data available.</p>
            )}

            {activeTab === 'hotels' && hotels.length > 0 ? (
              hotels.map((hotel) => (
                <div key={hotel.id} style={styles.card}
                     onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
                     onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.card)}
                >
                  <img src={hotel.image_url || '/assets/default_hotel.jpg'} alt={hotel.name} style={styles.cardImage} />
                  <div style={styles.cardContent}>
                    <h3 style={styles.cardTitle}>{hotel.name}</h3>
                    <p style={styles.cardText}>Location: {hotel.location}</p>
                    <p style={styles.cardText}>Price per night: PKR {hotel.price_per_night}</p>
                    <p style={styles.cardText}>Available Rooms: {hotel.available_rooms}/{hotel.total_rooms}</p>
                    <p style={styles.cardDescription}>{hotel.description}</p>
                    <button
                      style={styles.bookButton}
                      onClick={() => handleBooking(hotel, 'hotel')}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.bookButtonHover)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.bookButton)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : activeTab === 'hotels' && (
              <p style={styles.noData}>No hotel data available.</p>
            )}

            {activeTab === 'offers' && offers.length > 0 ? (
              offers.map((offer) => (
                <div key={offer.id} style={styles.card}
                     onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
                     onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.card)}
                >
                  <img src={offer.image_url || '/assets/default_offer.jpg'} alt={offer.title} style={styles.cardImage} />
                  <div style={styles.cardContent}>
                    <h3 style={styles.cardTitle}>{offer.title}</h3>
                    <p style={styles.cardText}>Discount: {offer.discount_details}</p>
                    <p style={styles.cardText}>Valid Until: {new Date(offer.valid_until).toLocaleDateString()}</p>
                    <p style={styles.cardDescription}>{offer.description}</p>
                    {/* Offers generally don't have direct booking buttons, but lead to relevant sections */}
                    <button
                      style={styles.bookButton}
                      onClick={() => alert('Offer details: ' + offer.description)}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.bookButtonHover)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.bookButton)}
                    >
                      View Offer
                    </button>
                  </div>
                </div>
              ))
            ) : activeTab === 'offers' && (
              <p style={styles.noData}>No special offers available.</p>
            )}
          </div>
        )}
      </div>
      <ChatBot/>
    </div>
  );
}

export default Dashboard;