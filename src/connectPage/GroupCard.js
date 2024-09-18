import React from 'react';

// Card component for displaying group details and join button
const GroupCard = ({ group, onJoin, isJoined }) => {
  const handleJoin = () => {
    if (!isJoined) {
      onJoin(group);
    }
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8 w-[30vw] h-[30vh] flex flex-col justify-between" role="alert">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={group.icon}
          alt={`${group.name} icon`}
          className="shrink-0 rounded-full w-16 h-16 object-cover border-2 border-blue-400"
        />
        <div>
          <p className="font-bold text-lg text-gray-800">{group.name}</p>
          <p className="text-sm text-gray-600">{group.description}</p>
          <p className="text-sm text-gray-600">Members: {group.members}</p>
        </div>
      </div>
      <div className="mt-auto">
        <button
          className={`inline-block w-full rounded-lg px-5 py-3 text-center text-sm font-semibold text-white ${isJoined ? 'bg-gray-400' : 'bg-blue-500'}`}
          onClick={handleJoin}
          disabled={isJoined}
        >
          {isJoined ? 'Joined' : 'Join Group'}
        </button>
      </div>
    </div>
  );
};

export default GroupCard;