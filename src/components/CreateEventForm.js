// frontend/src/components/CreateEventForm.js
import React, { useState, useContext } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/authContext';

const CreateEventForm = ({ onEventCreated }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Alumni Meetups');
  const { user } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/events', {
        title,
        date,
        time,
        location,
        description,
        imageUrl,
        category,
        postedBy: user._id,
      });

      onEventCreated(data); // Callback to refresh the event list
      setTitle('');
      setDate('');
      setTime('');
      setLocation('');
      setDescription('');
      setImageUrl('');
      setCategory('Alumni Meetups');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Create a New Event</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows="4"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Alumni Meetups">Alumni Meetups</option>
          <option value="Motivational Talks">Motivational Talks</option>
          <option value="Success Stories">Success Stories</option>
          <option value="Panel Discussions">Panel Discussions</option>
          <option value="Q&A Sessions">Q&A Sessions</option>
          <option value="Tech Sessions">Tech Sessions</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
      >
        Create Event
        <span class="material-icons px-2">
          create
        </span>
      </button>
    </form>
  );
};

export default CreateEventForm;