import "./Message.css";
import { format } from "timeago.js";

export default function Message({ message, own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740&t=st=1725699415~exp=1725700015~hmac=04feb55fd8848c29e1fd50fe7f67686ef34ea6bf5b89e8a9d2a8ce02688f1173"
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      {/* <div className="messageBottom">1 hour ago</div> */}
      <div className="messageBottom">{format(message?.createdAt)}</div>
    </div>
  );
}