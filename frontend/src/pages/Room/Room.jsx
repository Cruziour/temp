import React from 'react';
import useWebRTC from '../../hooks/useWebRtc';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Room = () => {
  const { user } = useSelector((state) => state.authSlice);
  const { id: roomId } = useParams();
  const { clients, provideRef } = useWebRTC(roomId, user);
  return (
    <div>
      <h1>All Connected Clients</h1>
      {clients.map((client) => {
        return (
          <div key={client?._id}>
            <audio
              controls
              autoPlay
              ref={(instance) => provideRef(instance, client?._id)}
            ></audio>
            <h4>{client?.name}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default Room;
