// src/components/ConnectCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const ConnectCard = ({
  data,
  currentPosition,
  isConnected = false,
  userId,
  requestSent = false,
  isRequestReceived = false,
  onSendRequest,
  onAcceptRequest,
  onCancelRequest,
  onDeclineRequest, // Add this prop
}) => {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8 w-[30vw]" role="alert">
      <div className="flex items-center gap-4">
        <img
          src={data?.profileImg}
          alt={`${data?.name}'s profile`}
          className="shrink-0 rounded-full w-16 h-16 object-cover border-2 border-blue-400"
        />
        <div>
          <p className="font-bold text-lg text-gray-800">{data?.name}
            <span className={`text-sm px-1 m-3 font-light border rounded-lg ${data?.type === 'Student' ? 'text-blue-400 border-blue-400' : 'text-yellow-500  border-yellow-500'}`}>{data?.type}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">{data?.education[0]?.degree} - Class of {data?.education[0]?.year}</p>
        </div>
      </div>
      <div className="mt-4 text-gray-600">
        <p><strong>Currently:</strong> {currentPosition}</p>
        <p><strong>About:</strong> {data?.bio}</p>
        <p><strong>Interests:</strong> <span className='text-blue-500'>{data?.areasOfInterest.join(', ')}</span></p>
      </div>
      <div className="mt-6 sm:flex sm:gap-4">
        {!isConnected && !requestSent && !isRequestReceived && (
          <button
            className="inline-block w-full rounded-lg px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto bg-blue-500"
            onClick={onSendRequest}
          >
            Connect with {data?.name.split(' ')[0]}
          </button>
        )}
        {requestSent && !isRequestReceived && (
          <button
            className="inline-block w-full rounded-lg px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto bg-red-500"
            onClick={onCancelRequest}
          >
            Cancel Request
          </button>
        )}
        {isRequestReceived && (
          <>
            <button
              className="inline-block w-full rounded-lg px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto bg-green-500"
              onClick={onAcceptRequest}
            >
              Accept
            </button>
            <button
              className="inline-block w-full rounded-lg px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto bg-gray-500"
              onClick={onDeclineRequest}
            >
              Decline
            </button>
          </>
        )}
        <Link
          to={`/profile/${userId}`}
          className="mt-2 inline-block w-full rounded-lg bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default ConnectCard;