// src/pages/EventDetailsPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios';
import { AuthContext } from '../context/authContext';

const EventDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state;
  const { user } = useContext(AuthContext);

  // Initialize form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    paymentInfo: ''
  });

  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Check if the user is already registered for the event
    const checkRegistration = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`/api/events/${event._id}/is-registered`, config);
        setIsRegistered(response.data.isRegistered);
      } catch (error) {
        console.error('Error checking registration status:', error);
      }
    };

    checkRegistration();
  }, [event._id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    console.log('Form submitted:', formData);

    try {
      await handleRegistration(event);
      alert(`You have successfully ${isRegistered ? 'unregistered from' : 'registered for'} ${event.title}`);
      navigate('/events');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  // Handle registration/unregistration
  const handleRegistration = async (event) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const url = `/api/events/${event._id}/${isRegistered ? 'unregister' : 'register'}`;
      await axios.put(url, {}, config);
      setIsRegistered(!isRegistered);
    } catch (error) {
      console.error('Error updating registration:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover mb-6" />
      <p className="text-xl text-gray-700 mb-4">{event.description}</p>
      <p className="text-sm text-gray-600">{event.date}, {event.time}</p>
      <p className="text-sm text-gray-500 mb-6">{event.location}</p>

      {/* Back button */}
      <button onClick={() => navigate(-1)} className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4">
        Back
      </button>
      {isRegistered ?
        (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">You are registered for this event</h2>
            <button
              onClick={handleSubmit}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Unregister
            </button>
          </div>
        ) :
        (

          < form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Register for this Event</h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter your email"
                required
              />
            </div>

            {event.hasPayment && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Payment Details</label>
                <input
                  type="text"
                  name="paymentInfo"
                  value={formData.paymentInfo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter payment information"
                />
              </div>
            )}

            <button
              type="submit"
              className='bg-blue-500 text-white px-4 py-2 rounded-lg'
            >
              Register
            </button>
          </form>
        )
      }
    </div>
  );
};

export default EventDetailsPage;