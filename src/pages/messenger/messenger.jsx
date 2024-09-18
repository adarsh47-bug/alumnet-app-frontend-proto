import './messenger.css';
import Conversation from '../../components/conversation/Conversation';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { AuthContext } from '../../context/authContext';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from '../../axios';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

export default function Messenger() {
  const location = useLocation();
  const { currentChat: initialChat } = location.state || {};
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(initialChat || null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userConnections, setUserConnections] = useState([]); // Store user connection data
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("https://alumnet-socket-proto.onrender.com/");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
        conversationId: data.conversationId,
      });
    });
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      const updatedConversations = conversations.map((conversation) =>
        conversation?._id === arrivalMessage.conversationId
          ? { ...conversation, latestMessage: arrivalMessage }
          : conversation
      );

      const sortedConversations = [
        updatedConversations?.find(
          (conversation) => conversation?._id === arrivalMessage.conversationId
        ),
        ...updatedConversations.filter(
          (conversation) => conversation?._id !== arrivalMessage.conversationId
        ),
      ];

      setConversations(sortedConversations);

      if (currentChat?._id === arrivalMessage.conversationId) {
        setMessages((prev) => [...prev, arrivalMessage]);
      }
    }
  }, [arrivalMessage, currentChat, conversations]);

  useEffect(() => {
    if (user?._id) {
      socket?.current.emit('addUser', user?._id);
      socket?.current.on("getUsers", (users) => {
        setOnlineUsers(
          user.connections.filter((f) => users.some((u) => u.userId === f))
        );
      });
    }
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get('/api/conversations/' + user?._id);
        const conversationsWithLatestMessage = await Promise.all(
          res.data.map(async (conversation) => {
            const messagesRes = await axios.get(`/api/messages/${conversation?._id}`);
            const latestMessage = messagesRes.data[messagesRes.data.length - 1];
            return { ...conversation, latestMessage };
          })
        );
        setConversations(conversationsWithLatestMessage);
      } catch (err) {
        console.log(err);
      }
    };
    if (user?._id) {
      getConversations();
    }
  }, [user?._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get('/api/messages/' + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat) {
      getMessages();
    }
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentChat || !user?._id) return;

    const message = {
      sender: user?._id,
      text: newMessages,
      conversationId: currentChat?._id,
    };

    const receiverId = currentChat.members?.find(member => member !== user?._id);

    socket.current.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      text: newMessages
    });

    try {
      const res = await axios.post('/api/messages', message);
      setMessages([...messages, res.data]);
      setNewMessages('');

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation?._id === currentChat?._id
            ? { ...conversation, latestMessage: res.data }
            : conversation
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseChat = () => {
    if (messages.length === 0) {
      setConversations((prev) =>
        prev.filter((conversation) => conversation?._id !== currentChat?._id)
      );
    }
    setCurrentChat(null);
  };

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await axios.get('/api/users/connections-list/' + user?._id, config);
        setUserConnections(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (user?._id) {
      fetchConnections();
    }
  }, [user?._id]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setSearchResults([]);
    } else {
      const filteredResults = userConnections.filter(connection =>
        connection.name?.toLowerCase().includes(e.target.value?.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
  };

  const handleConversationStart = (connection) => {
    const existingConversation = conversations?.find(conversation =>
      conversation.members.includes(connection?._id)
    );

    if (existingConversation) {
      setCurrentChat(existingConversation);
    } else {
      const newConversation = {
        members: [user?._id, connection?._id],
        latestMessage: null,
      };
      setConversations([...conversations, newConversation]);
      setCurrentChat(newConversation);
    }

    // Clear search input and results
    setSearchTerm('');
    setSearchResults([]);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='messenger'>
      <div className='chatMenu'>
        <div className='chatMenuWrapper'>
          <h3 className='chatMenuTitle'>
            Recent conversations
          </h3>
          <div className='relative'>
            <input
              placeholder='Search for connections'
              className='chatMenuInput pr-12'
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500'
              >
                Clear
              </button>
            )}
          </div>
          {searchResults.length > 0 ? (
            <div className='conversationMenu'>
              {searchResults.map((connection) => (
                <div key={connection?._id} onClick={() => handleConversationStart(connection)}>
                  <Conversation active={currentChat?.members.includes(connection?._id)} searchResults={connection} currentUser={user} />
                </div>
              ))}
            </div>
          ) : searchTerm && searchResults.length === 0 ? (
            <div className='notFound'>No connections found.</div>
          ) : (
            <div className='conversationMenu'>
              {conversations
                .concat(currentChat && !conversations?.find((c) => c?._id === currentChat?._id) ? [currentChat] : [])
                .filter(c => c?.latestMessage || c?._id === currentChat?._id)
                .sort((a, b) => new Date(b?.latestMessage?.createdAt || 0) - new Date(a?.latestMessage?.createdAt || 0))
                .map((c) => (
                  <div key={c?._id} onClick={() => { setCurrentChat(c) }}>
                    <Conversation active={c?._id === currentChat?._id} conversation={c} currentUser={user} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className='chatBox'>
        <div className='chatBoxWrapper'>
          {
            currentChat ? (
              <>
                <div className='chatBoxTop'>
                  {messages.map((m) => (
                    <div ref={scrollRef} key={m?._id}>
                      <Message message={m} own={m.sender === user?._id} />
                    </div>
                  ))}
                </div>
                <div className='chatBoxBottom'>
                  <textarea
                    className='chatMessageInput'
                    placeholder='write something...'
                    onChange={(e) => setNewMessages(e.target.value)}
                    value={newMessages}
                  ></textarea>
                  <button className='chatSubmitButton' onClick={handleSubmit}>Send</button>
                </div>
                <button className='chatCloseButton' onClick={handleCloseChat}>Close Chat</button>
              </>
            ) : (
              <span className='noConversationText'>Open a conversation to start a chat.</span>
            )
          }
        </div>
      </div>
      <div className='chatOnline'>
        <div className='chatOnlineWrapper relative pt-[4rem]'>
          <h3 className='chatMenuTitle absolute w-[100%] top-0'>
            Online connections
          </h3>
          <ChatOnline
            onlineUsers={onlineUsers}
            currentId={user?._id}
            setCurrentChat={setCurrentChat}
          />
        </div>
      </div>
    </div>
  );
}
