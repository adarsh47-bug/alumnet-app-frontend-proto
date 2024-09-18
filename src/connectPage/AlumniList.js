// src/connectPage/AlumniList.js
import React from 'react';
import ConnectCard from '../connectPage/ConnectCard';

const AlumniList = ({ alumni, isConnectedTab, onSendRequest, onAcceptRequest, onCancelRequest, onDeclineRequest, isRequestReceived = false, requestSent = false }) => {
  return alumni.length > 0 ? (
    <ul className="flex flex-wrap">
      {[...alumni].map((alumnus, index) => (
        <li key={index} className="m-2">
          <ConnectCard
            data={alumnus}
            currentPosition={alumnus?.experience?.length === 0 ? 'No specified' : `${alumnus?.experience[0]?.position} at ${alumnus?.experience[0]?.company}`}
            isConnected={isConnectedTab}
            userId={alumnus?._id}
            requestSent={requestSent}
            isRequestReceived={isRequestReceived}
            onSendRequest={() => onSendRequest(alumnus)}
            onAcceptRequest={() => onAcceptRequest(alumnus)}
            onCancelRequest={() => onCancelRequest(alumnus)}
            onDeclineRequest={() => onDeclineRequest(alumnus)} // Add this line
          />
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-600">No connections available.</p>
  );
};

export default AlumniList;