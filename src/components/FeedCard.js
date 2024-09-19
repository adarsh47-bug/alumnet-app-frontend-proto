// component/FeedCard.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';
import axios from '../axios';

const FeedCard = ({ post, onDeletePost, onLikePost, onCommentPost, onClosePost, user, connections }) => {
  const [showComments, setShowComments] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [comment, setComment] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  const handleClose = () => {
    onClosePost(post?._id);
  };

  const handleDelete = async () => {
    try {
      await onDeletePost(post?._id);
      console.log('Deleted post:', post);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (comment.trim() !== '') {
      await onCommentPost(post?._id, comment);
      setComment('');
    }
  };

  const handleConnectNow = () => {
    navigate(`/profile/${post?.author?._id}`);
  };

  const fetchProfileImg = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`/api/users/profile/${post?.author?._id}`, config);
      setProfileImg(res.data.profileImg);
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  useEffect(() => {
    if (post?.author?._id) {
      fetchProfileImg()
    }
  }, [post?.author?._id]);


  const isConnected = connections.some((connection) => connection._id === post?.author?._id);

  const contentPreviewLimitArticle = 500; // Limit for preview content
  const contentPreviewLimit = 250; // Limit for preview content
  const linkPreviewLimit = 50; // Limit for link text

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-300">
      <div className="flex items-center mb-4">
        <img
          onClick={handleConnectNow}
          src={profileImg || 'https://freepikpsd.com/media/2019/10/default-user-profile-image-6.jpg'}
          alt="Avatar"
          className="w-10 h-10 rounded-full mr-4 cursor-pointer object-cover"
        />
        <div>
          <h2 onClick={handleConnectNow} className="text-lg font-semibold cursor-pointer">{post?.author?.name}</h2>
          <p className="text-sm text-gray-500">{format(post?.createdAt)}</p>
        </div>

        {post?.author?._id !== user._id && (
          isConnected ? (
            <span className="text-green-500 text-md px-4 max-sm:hidden">Connected</span>
          ) : (
            <button
              onClick={handleConnectNow}
              className="text-blue-500 text-md hover:underline px-4 max-sm:hidden"
            >
              Connect Now
            </button>
          )
        )}
        <div className="flex items-center ml-auto">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="ml-auto hover:bg-slate-200 rounded-full size-12 pt-1"
          >
            <span className="material-icons px-2">more_horiz</span>
          </button>
          {showOptions && (
            <div ref={optionsRef} className="absolute max-sm:right-0 bg-white shadow-lg rounded-md mt-2">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer  flex items-center justify-between">Edit post
                  <span className="material-icons px-2">edit</span>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">Bookmark
                  <span className="material-icons px-2">bookmark</span>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">Copy link
                  <span className="material-icons px-2">link</span>
                </li>
                {post?.author?._id === user._id && (
                  <li onClick={handleDelete} className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">Delete post
                    <span className="material-icons px-2">delete</span>
                  </li>
                )}
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">Report post
                  <span className="material-icons px-2">report</span>
                </li>
                <li onClick={handleClose} className="sm:hidden px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">Close post
                  <span className="material-icons px-2">close</span>
                </li>
                <li className="sm:hidden px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                  {post?.author?._id !== user._id && (
                    isConnected ? (
                      <span className="text-green-500 text-md px-4">Connected</span>
                    ) : (
                      <button
                        onClick={handleConnectNow}
                        className="text-blue-500 text-md hover:underline px-4"
                      >
                        Connect Now
                      </button>
                    )
                  )}
                </li>
              </ul>
            </div>
          )}
          <button
            onClick={handleClose}
            className="ml-auto hover:text-red-600 hover:bg-slate-200 rounded-full size-12 pt-1 max-sm:hidden"
          >
            <span className="material-icons px-2">close</span>
          </button>
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-xl max-sm:text-lg font-medium mb-2">{post?.title}</h3>

        {/* Render different types of content */}
        {post?.type === 'media' && (
          <div>
            <img
              src={post?.media}
              alt="Post media"
              className={`w-full object-cover my-4 rounded-lg max-h-[${post?.size > 42 ? 42 : post?.size}rem] max-sm:min-h-[19rem]`}
            />
            <p className="text-gray-600 py-2 text-base">
              {showFullContent || post?.content.length <= contentPreviewLimit
                ? post?.content
                : `${post?.content.substring(0, contentPreviewLimit)}...`}
              {post?.content.length > contentPreviewLimit && !showFullContent && (
                <button
                  onClick={() => setShowFullContent(true)}
                  className="text-blue-700 hover:underline pb-2"
                >
                  read more
                </button>
              )}
            </p>


          </div>
        )}
        {post?.type === 'article' && (
          <div>
            <p className="text-gray-600 py-2 text-base">
              {showFullContent || post?.content.length <= contentPreviewLimit
                ? post?.content
                : `${post?.content.substring(0, contentPreviewLimitArticle)}...`}
              {post?.content.length > contentPreviewLimit && !showFullContent && (
                <button
                  onClick={() => setShowFullContent(true)}
                  className="text-blue-700 hover:underline pb-2"
                >
                  read more
                </button>
              )}
            </p>

            {post?.link && (
              <div className="text-gray-500 flex items-center text-base">
                <p className="pr-1">Read full article:</p>
                <a
                  href={post?.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {post?.link.length > linkPreviewLimit
                    ? `${post?.link.substring(0, linkPreviewLimit)}...`
                    : post?.link}
                </a>
              </div>
            )}
          </div>
        )}
        {post?.type === 'discussion' && (
          <div>
            {/* Shorten content if too long */}
            <p className="text-gray-600 py-2 text-base">
              {showFullContent || post?.content.length <= contentPreviewLimit
                ? post?.content
                : `${post?.content.substring(0, contentPreviewLimit)}...`}
              {post?.content.length > contentPreviewLimit && !showFullContent && (
                <button
                  onClick={() => setShowFullContent(true)}
                  className="text-blue-400 hover:underline pb-2"
                >
                  read more
                </button>
              )}
            </p>

            <div className="border-t border-gray-300 mt-4 pt-2">
              <h4 className=" font-medium mb-2">Discussion Thread</h4>
              <button
                className="text-blue-400 hover:underline mb-2"
                onClick={() => setShowComments(!showComments)}
              >
                {showComments ? 'Hide Comments' : 'View Comments'}
              </button>
              {showComments && (
                <div className="text-gray-600 mt-2">
                  {post?.comments?.length > 0 ? (
                    post.comments.map((comment, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex items-center">
                          <img
                            src={comment.author.avatar}
                            alt="Comment Avatar"
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <h5 className="text-sm font-semibold">
                              {comment.author.name}
                            </h5>
                            <p className="text-xs text-gray-500">
                              {format(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet. Be the first to comment!</p>
                  )}
                </div>
              )}
            </div>

            {/* Comment section */}
            <div className="mt-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-2"
                placeholder="Join the discussion..."
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Post Comment
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between text-gray-500 pt-2 border-t border-gray-300">
        {post.type !== 'discussion' && (
          <>
            <button
              // onClick={() => onLikePost(post?._id)}
              className="flex items-center hover:bg-slate-200 px-4 py-2 rounded-md"
            >
              <span>{post?.likes?.length || 0}</span>
              <span className="material-icons px-2">thumb_up</span>
              <span className='max-sm:hidden'> Like</span>
            </button>
            <button
              // onClick={() => setShowComments(!showComments)}
              className="flex items-center hover:bg-slate-200 px-4 py-2 rounded-md"
            >
              <span>{post?.comments?.length || 0}</span>
              <span className="material-icons px-2">comment</span>
              <span className='max-sm:hidden'> Comment</span>
            </button>
          </>
        )}
        <button className="flex items-center hover:bg-slate-200 px-4 py-2 rounded-md">
          <span>{post?.shares || 0}</span>
          <span className="material-icons px-2">share</span>
          <span className='max-sm:hidden'>Share</span>
        </button>
      </div>
    </div>
  );
};

export default FeedCard;