import React from 'react';
import useWebRTC from '../../hooks/useWebRtc';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';

const Room = () => {
  const { user } = useSelector((state) => state.authSlice);
  const { roomId } = useParams();
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);

  return (
    <>
      <div className="relative top-3 left-20">
        <button className="bg-[#29292d] hover:bg-[#3a3a3e] text-white px-4 py-2 rounded-full flex items-center">
          ✌ Leave quietly
        </button>
      </div>
      <div className="absolute bottom-0 w-full bg-transparent">
        <div>
          <div className="bg-[#1c1c1e] h-[80vh] text-white rounded-t-4xl p-4">
            <section>
              <h2 className="text-lg font-medium mb-4">Speakers</h2>
              <div className="grid grid-cols-8 gap-6 mb-10">
                {clients.slice(0, 4).map((client) => (
                  <ClientAvatar
                    key={client?._id}
                    client={client}
                    provideRef={provideRef}
                    isSpeaker={true}
                    handleMute={handleMute}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-medium mb-4">Other in the room</h2>
              <div className="grid grid-cols-6 gap-6">
                {clients.slice(4).map((client) => (
                  <ClientAvatar
                    key={client._id}
                    client={client}
                    provideRef={provideRef}
                    handleMute={handleMute}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

const ClientAvatar = ({
  client,
  provideRef,
  isSpeaker = false,
  handleMute,
}) => {
  const { user } = useSelector((state) => state.authSlice);
  const [isMute, setIsMute] = useState(client._id === user._id); // Only track own mute state

  const isCurrentUser = client._id === user._id;

  const handleMuteClick = () => {
    if (!isCurrentUser) return;
    const nextMuteState = !isMute;
    setIsMute(nextMuteState);
    handleMute(nextMuteState, client._id);
  };

  useEffect(() => {
    if (isCurrentUser) {
      handleMute(isMute, client._id);
    }
  }, [client._id, handleMute, isCurrentUser, isMute]);

  return (
    <div className="flex flex-col items-center text-center relative">
      <audio
        autoPlay
        ref={(instance) => provideRef(instance, client._id)}
        className="hidden"
      />

      {isCurrentUser && (
        <button
          onClick={handleMuteClick}
          className="absolute bottom-7 left-24 bg-black rounded-full p-1 cursor-pointer"
        >
          <img
            src={`/images/${isMute ? 'mic-mute' : 'mic'}.png`}
            alt="mic"
            className="w-5 h-5"
          />
        </button>
      )}

      <div
        className={`w-16 h-16 rounded-full border-4 ${
          isSpeaker ? 'border-yellow-500' : 'border-blue-500'
        } overflow-hidden mb-2`}
      >
        <img
          src={client.avatar}
          alt={client.name}
          className="w-full h-full object-cover"
        />
      </div>

      <span className="text-sm">{client.name}</span>
    </div>
  );
};


export default Room;
