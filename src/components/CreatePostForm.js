// frontend/src/components/CreatePostForm.js
import React, { useContext, useState } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/authContext';

const CreatePostForm = ({ onPostCreated }) => {
  const [type, setType] = useState('article');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState('');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [size, setSize] = useState('max-h-[35rem]');
  const { user } = useContext(AuthContext);

  console.log(user);
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/posts/', {
        author: user._id,
        type,
        content,
        media,
        title,
        link,
        size,
      });

      onPostCreated(data); // Callback to refresh the post list
      setType('article');
      setContent('');
      setMedia('');
      setTitle('');
      setLink('');
      setSize('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg max-sm:p-1">
      <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Post Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="article">Article</option>
          <option value="media">Media</option>
          <option value="discussion">Discussion Thread</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          maxLength={100} // Set max length to 100
          placeholder={`Title`}
        />
        <p className="text-gray-600">{`${title.length}/100`}</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          rows="4"
          maxLength={10000} // Set max length to 1000
          placeholder={`Write something...`}
        ></textarea>
        <p className="text-gray-600">{`${content.length}/10000`}</p>
      </div>

      {type === 'media' && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Media URL</label>
          <input
            type="text"
            value={media}
            onChange={(e) => setMedia(e.target.value)}
            className="w-full p-2 border rounded"
            maxLength={1000} // Set max length to 1000
            placeholder={`e.g. https://example.com/image.jpg`}
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Link</label>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border rounded"
          maxLength={1000} // Set max length
          placeholder={`e.g. https://example.com`}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Size</label>
        <input
          type="text"
          placeholder={`e.g. 35`}
          onChange={(e) => setSize(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-between"
      >
        Create Post
        <span class="material-icons px-2">create</span>
      </button>
    </form>
  );
};

export default CreatePostForm;