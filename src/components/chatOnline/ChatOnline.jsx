import { useEffect, useState } from "react";
import "./ChatOnline.css";
import axios from "../../axios";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const PF = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740&t=st=1725699415~exp=1725700015~hmac=04feb55fd8848c29e1fd50fe7f67686ef34ea6bf5b89e8a9d2a8ce02688f1173";

  useEffect(() => {
    const getFriends = async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const res = await axios.get("/api/users/connections-list/" + currentId, config);
      setFriends(res.data);
    };
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(`/api/conversations/find/${currentId}/${user._id}`);
      if (!res.data) {
        const res = await axios.post("/api/conversations/", {
          senderId: currentId,
          receiverId: user._id,
        });
        setCurrentChat(res.data);
      } else {
        setCurrentChat(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chatOnline2">
      {[...onlineFriends].map((o, i) => (
        <div key={i} className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              src={o?.profileImg || PF}
              alt=""
              className="chatOnlineImg"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.name}</span>
        </div>
      ))}
    </div>
  )
}
