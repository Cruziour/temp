import React from 'react';
import useWebRTC from '../../hooks/useWebRtc';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Room = () => {
  const { user } = useSelector((state) => state.authSlice);
  const { id: roomId } = useParams();
  const { clients, provideRef } = useWebRTC(roomId, user);

  return (
    <>
      <div className="relative top-10 left-20">
        <button className="bg-[#29292d] hover:bg-[#3a3a3e] text-white px-4 py-2 rounded-full flex items-center">
          ✌ Leave quietly
        </button>
      </div>
      <div className="absolute bottom-0 w-full p-2 border border-transparent rounded-4xl">
        <div className="bg-[#1c1c1e] h-[75vh] text-white p-6">
          <header className="flex justify-between items-center mb-6">
            {/* <h1 className="text-xl font-semibold">
          Artificial intelligence is the future?
        </h1> */}
            {/* <button className="bg-[#29292d] hover:bg-[#3a3a3e] text-white px-4 py-2 rounded-full flex items-center">
          ✌ Leave quietly
        </button> */}
          </header>

          <section>
            <h2 className="text-lg font-medium mb-4">Speakers</h2>
            <div className="grid grid-cols-4 gap-6 mb-10">
              {clients.slice(0, 4).map((client) => (
                <ClientAvatar
                  key={client._id}
                  client={client}
                  provideRef={provideRef}
                  isSpeaker={true}
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
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

const ClientAvatar = ({ client, provideRef, isSpeaker = false }) => {
  return (
    <div className="flex flex-col items-center text-center relative">
      <audio
        autoPlay
        ref={(instance) => provideRef(instance, client._id)}
        className="hidden"
      />
      <div
        className={`w-20 h-20 rounded-full border-4 ${
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
