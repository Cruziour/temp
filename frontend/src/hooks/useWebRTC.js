import { useCallback, useEffect, useRef } from 'react';
import useStateWithCallback from './useStateWithCallBack';
import socketInit from '../socket';
import { ACTIONS } from '../actions';
import freeice from 'freeice';

const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = socketInit();
  }, []);

  // Add new clients - FIXED: using functional update to avoid stale closure
  const addNewClient = useCallback(
    (newClient, cb) => {
      setClients((existingClients) => {
        const alreadyPresent = existingClients.find(
          (client) => client?._id === newClient?._id
        );
        if (!alreadyPresent) {
          //   console.log('✅ Adding new client:', newClient);
          return [...existingClients, newClient];
        } else {
          //   console.log('🚫 Client already exists:', newClient);
        }
        return existingClients;
      }, cb);
    },
    [setClients]
  );

  // Start audio capture
  useEffect(() => {
    if (!user || !user._id) return;

    const startCapture = async () => {
      try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        addNewClient(user, () => {
          const localElement = audioElements.current[user._id];
          if (localElement) {
            localElement.volume = 0; // mute local mic playback
            localElement.srcObject = localMediaStream.current;
          }
          // socket emit join using socket.io
          socket.current.emit(ACTIONS.JOIN, { roomId, user });
        });
      } catch (error) {
        console.error('Could not get user media:', error);
      }
    };

    startCapture();
    return () => {
      // leaving the room
      localMediaStream.current?.getTracks()?.forEach((track) => track.stop());
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, [user, addNewClient]);

  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      // already connected give waringing
      if (peerId in connections.current) {
        return console.warn(
          `Your are already connected with ${peerId} (${user?.name})`
        );
      }
      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });
      // handle new ice candidate
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      };
      // handle on track this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient(remoteUser, () => {
          // if check audio elements is present or not
          if (audioElements.current[remoteUser?._id]) {
            audioElements.current[remoteUser?._id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser?._id]) {
                audioElements.current[remoteUser?._id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };
      // Add local track to remote connections
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });
      // Create offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        await connections.current[peerId].setLocalDescription(offer);
        //send offer to another client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };
    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, []);

  //handle ice candidate
  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });
    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  // handle session description
  useEffect(() => {
    const handleRemoteSDP = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );
      // if session description is typeof offer then create an answer
      if (remoteSessionDescription.type === 'offer') {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();
        connection.setLocalDescription(answer);
        // send answer to another client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };
    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSDP);
    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  // handle remove peer
  useEffect(() => {
    const handleRemovePeer = async ({ peerId, userId }) => {
      // remove peer from connections
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }
      delete connections.current[peerId];
      delete audioElements.current[peerId];
      setClients((list) => list.filter((client) => client._id !== userId));
    };
    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  return { clients, provideRef };
};

export default useWebRTC;
