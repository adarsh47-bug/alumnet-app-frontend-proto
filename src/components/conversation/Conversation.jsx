import React, { useEffect, useState } from 'react';
import './Conversation.css';
import axios from '../../axios';
import { format } from "timeago.js";

export default function Conversation({ conversation, searchResults, currentUser, active = false }) {
  const [user, setUser] = useState(null);
  const PF = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740&t=st=1725699415~exp=1725700015~hmac=04feb55fd8848c29e1fd50fe7f67686ef34ea6bf5b89e8a9d2a8ce02688f1173";

  useEffect(() => {
    const friendId = conversation?.members?.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await axios.get(`/api/users/profile/${friendId}`, config);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className={active ? "conversation active" : 'conversation'}>
      <img
        className='conversationImg size-12'
        src={user?.profileImg || searchResults?.profileImg || PF}
        alt=''
      />
      <div className='conversationDetails'>
        <span className='conversationName'>{user?.name || searchResults?.name || 'Anonymous'}</span>
        {conversation?.latestMessage && (
          <span className='timestamp px-2'>{format(conversation.latestMessage.createdAt)}</span>
        )}
      </div>
    </div>
  );
}