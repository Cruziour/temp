import React from 'react';

const RoomCard = ({ room }) => {
  return (
    <div className="hover:bg-[#353333] relative bg-[#1d1d1d] rounded-4xl cursor-pointer text-sm p-6 min-h-[30vh] mx-h-[45vh] h-[33vh]">
      <h3 className="text-xl font-semibold pb-8">{room?.topic}</h3>
      {/* creator  */}
      <div className="flex justify-center">
        {room?.creator && (
          <>
            <div className="w-[20vw] h-16">
              <img
                key={room?.creator._id}
                src={room?.creator.avatar}
                alt="speaker-avatar"
                className="w-16 h-16 border-2 border-blue-700 ml-2 rounded-full p-1 contain-cover"
              />
            </div>
          </>
        )}
        <div className="w-[60vw] flex justify-start">
          <div>
            {room?.creator && (
              <>
                <div className="flex gap-x-1" key={room?.creator._id}>
                  <h3 className="text-lg pb-2">{room?.creator.name}</h3>
                  <img
                    src="/images/chat-bubble.png"
                    alt="chat"
                    className="w-4 h-4"
                  />
                </div>
                <p className="text-sm text-gray-400 leading-snug">
                  {room?.creator?.description}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Total People (positioned bottom-right) */}
      <div className="absolute bottom-4 right-4 flex gap-x-1 items-center">
        <span>{room.totalPeople}</span>
        <img src="/images/user-icon.png" alt="user-icon" className="w-4 h-4" />
      </div>
    </div>
  );
};

export default RoomCard;
