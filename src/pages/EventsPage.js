// src/pages/EventsPage.jsq
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios'; // For API requests
import Wrapper from '../components/Wrapper';
import CreateEventForm from '../components/CreateEventForm';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const EventCard = ({ event, onRegister, viewBtn = false }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
    <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
    <div className="p-4 flex-grow">
      <h3 className="text-xl font-semibold text-blue-700">{event.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{event.date}, {event.time}</p>
      <p className="text-sm text-gray-500 mt-1">{event.location}</p>
      <p className="text-gray-700 mt-4">{event.description}</p>
    </div>
    <div className="p-4 bg-gray-50 flex justify-between items-center">
      {(viewBtn) ?
        <button
          onClick={() => onRegister(event)}
          className={`px-4 py-2 rounded-md text-black bg-gray-200`}
        >
          View Details
        </button>
        :
        <button
          onClick={() => onRegister(event)}
          className={`px-4 py-2 rounded-md text-white ${event.isRegistered ? 'bg-red-500' : 'bg-blue-500'}`}
        >
          {event.isRegistered ? 'Unregister' : 'Register'}
        </button>
      }
    </div>
  </div>
);

const Sidebar = ({ navigation, activeCategory, onCategoryClick }) => (
  <div className="w-[20%] h-screen border-r bg-white">
    <div className="px-4 py-6">
      <ul className="space-y-1">
        {navigation.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => onCategoryClick(item.name)}
              className={`w-full text-left rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-between ${activeCategory === item.name
                ? 'bg-gray-100 text-blue-700'
                : 'text-gray-500 hover:bg-gray-100 hover:text-blue-700'
                }`}
            >
              {item.name}
              <span class="material-icons">
                {item.tag}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const EventsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All Events');
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      if (activeCategory === 'My Registered Events') {
        try {
          const token = localStorage.getItem('token');
          if (!token) return 'token not found';
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get('/api/users/registered-events', config);
          setRegisteredEvents(data);
        } catch (error) {
          console.error('Error fetching registered events:', error);
        }
        return;
      }
      try {
        const { data } = await axios.get('/api/events', {
          params: { category: activeCategory !== 'All Events' ? activeCategory : '' },
        });
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [activeCategory]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleEventCreated = (newEvent) => {
    setEvents([newEvent, ...events]);
    setIsFormVisible(false); // Close the form after event creation
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setIsFormVisible(false);
    }
  };

  useEffect(() => {
    if (isFormVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFormVisible]);

  const filteredEvents = events.filter(event => {
    const matchesCategory = activeCategory === 'All Events' ||
      (activeCategory === 'My Registered Events' ? registeredEvents.some(registeredEvent => registeredEvent._id === event._id) : event.category === activeCategory);
    const matchesSearchTerm = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  return (
    <Wrapper>
      <div className="flex w-[100vw]">
        <Sidebar
          navigation={[
            { name: 'All Events', tag: 'event_note' },
            { name: 'My Registered Events', tag: 'event_available' },
            { name: 'Alumni Meetups', tag: 'groups_2' },
            { name: 'Motivational Talks', tag: 'moving' },
            { name: 'Success Stories', tag: 'timeline' },
            { name: 'Panel Discussions', tag: 'interpreter_mode' },
            { name: 'Q&A Sessions', tag: 'contact_support' },
            { name: 'Tech Sessions', tag: 'stream' },
          ]}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
        <div className="w-[80%] p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-800">{activeCategory}</h1>
            <button
              onClick={toggleForm}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              Post Event
              <span class="material-icons px-2">
                create
              </span>
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative mb-4 px-4 py-2 border rounded-lg w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='absolute right-5 top-1/2 transform -translate-y-[80%] text-gray-500'
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents
              .filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  viewBtn={activeCategory === 'My Registered Events'}
                  onRegister={() => navigate(`/event-details/${event.title}`, { state: { event } })}
                />
              ))}
            {
              filteredEvents.length === 0 && (
                <div className="text-start text-lg text-gray-500">
                  No events found
                </div>
              )
            }
          </div>
        </div>
      </div>

      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div ref={formRef} className="bg-white p-6 rounded-lg shadow-lg relative w-[50%] scale-[90%]">
            <button className="absolute top-2 right-2 border border-gray-500 rounded-lg px-2 py-1 hover:bg-red-400 hover:text-white" onClick={toggleForm}>
              <span className="material-icons">close</span>
            </button>
            <CreateEventForm onEventCreated={handleEventCreated} />
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default EventsPage;