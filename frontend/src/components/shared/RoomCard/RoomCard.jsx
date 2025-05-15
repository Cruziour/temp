import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/room/${room?._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="hover:bg-[#353333] relative bg-[#1d1d1d] rounded-4xl cursor-pointer text-sm p-6 min-h-[30vh] max-h-[45vh] h-[33vh]"
    >
      {/* Room Topic */}
      <h3 className="text-xl font-semibold pb-8 truncate">{room?.topic}</h3>

      {/* Creator Info */}
      {room?.creator && (
        <div className="flex items-start justify-start gap-x-4">
          {/* Avatar */}
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={room.creator.avatar}
              alt="creator-avatar"
              className="w-16 h-16 border-2 border-blue-700 rounded-full object-cover p-1"
            />
          </div>

          {/* Creator Name & Description */}
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-x-1">
              <h3 className="text-lg font-medium">{room.creator.name}</h3>
              <img
                src="/images/chat-bubble.png"
                alt="chat"
                className="w-4 h-4"
              />
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">
              {room?.description}
            </p>
          </div>
        </div>
      )}

      {/* Total People (Bottom-right corner) */}
      <div className="absolute bottom-4 right-4 flex items-center gap-x-1">
        <span>{room?.totalPeople}</span>
        <img src="/images/user-icon.png" alt="user-icon" className="w-4 h-4" />
      </div>
    </div>
  );
};

export default RoomCard;
