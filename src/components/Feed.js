// frontend/components/Feed.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from '../axios';
import FeedCard from './FeedCard';
import CreatePostForm from './CreatePostForm';
import { AuthContext } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [connections, setConnections] = useState([]);
  const popupRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('api/posts');
        setPosts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchConnections = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('/api/users/connections', config);
        setConnections(data.connections);
      } catch (error) {
        console.error('Error fetching connections:', error);
      }
    };

    fetchPosts();
    fetchConnections();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setIsPopupVisible(false); // Close the popup after post creation
  };

  const handleClosePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`api/posts/delete/${postId}`, config);

      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    if (isPopupVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupVisible]);

  return (
    <div className='max-lg:flex flex-col items-center min-h-[90vh]'>
      <article className="lg:absolute left-[5%] top-[13%] lg:w-[22%] rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg ">
        <div className="flex items-center gap-4">
          <img
            alt="Profile"
            src={user.profileImg}
            className="size-16 rounded-full object-cover "
          />
          <div className='w-[75%]'>
            <h3 className="text-lg font-medium text-white">{user.name}</h3>
            <p className="mt-1 text-xs font-medium text-gray-300">
              {user.type} with knowledge in {user.skills?.join(', ')}
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          <li><Link to="/profile" className="block h-full rounded-lg border border-gray-700 p-4 hover:border-pink-600"><strong className="font-medium text-white flex items-center justify-between">My profile<span class="material-icons px-2">person</span></strong></Link></li>
          <li onClick={() => alert("Currently in construction state.")} ><Link to="/" className="block h-full rounded-lg my-1 border border-gray-700 p-4 hover:border-pink-600"><strong className="font-medium text-white flex items-center justify-between">My feeds & bookmarks<span class="material-icons px-2">bookmark</span></strong></Link></li>
          <li><Link to="/messenger" className="block h-full rounded-lg my-1 border border-gray-700 p-4 hover:border-pink-600"><strong className="font-medium text-white flex items-center justify-between">Conversations<span class="material-icons px-2">forum</span></strong></Link></li>
          <li><Link to="/connect" className="block h-full rounded-lg my-1 border border-gray-700 p-4 hover:border-pink-600"><strong className="font-medium text-white flex items-center justify-between">Groups joined<span class="material-icons px-2">group</span></strong></Link></li>
          <li><Link to="/events" className="block h-full rounded-lg my-1 border border-gray-700 p-4 hover:border-pink-600"><strong className="font-medium text-white flex items-center justify-between">Stared events<span class="material-icons px-2">event_available</span></strong></Link></li>
          <li><a href='/careerai' className="block h-full rounded-lg my-1 border border-gray-700 p-4 hover:border-pink-600">
            <strong className="font-medium text-white flex items-center justify-between">Career guidance AI
              <span class="material-icons px-2">smart_toy</span>
            </strong></a>
          </li>
          <li><a href="/learnai" className="block h-full rounded-lg my-1 border border-gray-700 p-4 hover:border-pink-600">
            <strong className="font-medium text-white flex items-center justify-between">
              Learn with AI
              <span className="ml-2">
                <span class="material-icons px-2">school</span>
              </span>
            </strong></a>
          </li>
          <li>
            <a href="/logout" onClick={handleLogout} className="md:hidden block h-full rounded-lg my-1 border border-gray-700 p-4 hover:border-pink-600">
              <strong className="font-medium text-white flex items-center justify-between">Logout<span class="material-icons px-2">logout</span></strong>
            </a>
          </li>
        </ul>
      </article>

      <div className={`flex flex-row container max-sm:w-fit ${isPopupVisible ? 'blur-sm' : ''}`}>
        <div className="mx-auto p-4 max-sm:p-1 lg:w-[45%] md:w-[70%] sm:w-[90%] max-sm:w-fit">
          <h1 className="text-2xl font-semibold mb-6 max-sm:text-center max-sm:mt-8">Latest Feeds</h1>
          <div onClick={togglePopup} className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-600 max-sm:w-[92%] max-sm:m-auto max-sm:my-4">
            <div className="flex items-center gap-4 ">
              <img alt="Profile" src={user.profileImg} className="size-12 rounded-full object-cover" />
              <div className='w-[75%]'>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" placeholder="Write a post and share your thoughts." />
              </div>
              <button className='rounded-lg w-fit bg-blue-400 text-white font-semibold text-sm p-2 flex items-center justify-between'><span className='max-sm:hidden'>Create</span> <span class="material-icons px-2">create</span></button>
            </div>
          </div>
          <div className="space-y-4 max-sm:w-[92%] max-sm:m-auto">
            {
              posts.map((post) => (
                <FeedCard key={post._id} post={post} onDeletePost={handleDeletePost} onClosePost={handleClosePost} user={user} connections={connections} />
              ))
            }
          </div>
        </div>
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div ref={popupRef} className="bg-white p-6 rounded-lg shadow-lg relative lg:w-[50%] h-[85%] overflow-auto sm:w-[80%] max-sm:w-[100%] scale-[90%]">
            <button className="absolute top-2 right-2 border border-gray-500 rounded-lg px-2 py-1 hover:bg-red-400 hover:text-white flex items-center justify-between" onClick={togglePopup}>
              <span class="material-icons px-2">close</span>
            </button>
            <CreatePostForm onPostCreated={handlePostCreated} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;