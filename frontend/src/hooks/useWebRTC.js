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
  const clientsRef = useRef([]);

  // ✅ INIT SOCKET ONCE
  useEffect(() => {
    socket.current = socketInit();
  }, []);

  // ✅ ADD NEW CLIENT
  const addNewClient = useCallback(
    (newClient, cb) => {
      setClients((existingClients) => {
        const alreadyPresent = existingClients.find(
          (client) => client?._id === newClient?._id
        );
        if (!alreadyPresent) {
          return [...existingClients, newClient];
        }
        return existingClients;
      }, cb);
    },
    [setClients]
  );

  // ✅ START MEDIA CAPTURE & JOIN ROOM
  useEffect(() => {
    if (!user || !user._id) return;

    const startCapture = async () => {
      try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        addNewClient({ ...user, muted: true }, () => {
          const localElement = audioElements.current[user._id];
          if (localElement) {
            localElement.volume = 0;
            localElement.srcObject = localMediaStream.current;
          }
          socket.current.emit(ACTIONS.JOIN, { roomId, user });
        });
      } catch (error) {
        console.error('🎤 Could not get user media:', error);
      }
    };

    startCapture();

    // ✅ CLEANUP MEDIA STREAM ON LEAVE
    return () => {
      localMediaStream.current?.getTracks()?.forEach((track) => track.stop());
      socket.current?.emit(ACTIONS.LEAVE, { roomId });
    };
  }, [user, addNewClient, roomId]);

  // ✅ HANDLE NEW PEER CONNECTION
  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      if (peerId in connections.current) {
        return console.warn(`⚠ Already connected to ${peerId}`);
      }

      // Create peer connection with ICE servers
      const connection = new RTCPeerConnection({
        iceServers: freeice(),
      });

      connections.current[peerId] = connection;

      // 🔄 Relay ICE candidates to signaling server
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
          });
        }
      };

      // 🎧 Attach remote stream to corresponding audio element
      connection.ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          if (audioElements.current[remoteUser._id]) {
            audioElements.current[remoteUser._id].srcObject = remoteStream;
          } else {
            // 🔁 Retry every 1s until audio element is ready
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser._id]) {
                audioElements.current[remoteUser._id].srcObject = remoteStream;
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };

      // ✅ Add local audio stream to connection
      localMediaStream.current?.getTracks().forEach((track) => {
        connection.addTrack(track, localMediaStream.current);
      });

      // ✅ Offer creation
      if (createOffer) {
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
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
  }, [addNewClient]);

  // ✅ HANDLE INCOMING ICE CANDIDATES
  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      const connection = connections.current[peerId];
      if (connection && icecandidate) {
        connection.addIceCandidate(new RTCIceCandidate(icecandidate));
      }
    });

    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  // ✅ HANDLE SESSION DESCRIPTION
  useEffect(() => {
    const handleRemoteSDP = async ({ peerId, sessionDescription }) => {
      const connection = connections.current[peerId];
      if (!connection) return;

      await connection.setRemoteDescription(
        new RTCSessionDescription(sessionDescription)
      );

      if (sessionDescription.type === 'offer') {
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
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

  // ✅ HANDLE REMOVE PEER
  useEffect(() => {
    const handleRemovePeer = ({ peerId, userId }) => {
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
  }, [setClients]);

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  // listen for mute and unmute
  useEffect(() => {
    socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
      setMute(true, userId);
    });
    socket.current.on(ACTIONS.UN_MUTEMUTE, ({ peerId, userId }) => {
      setMute(false, userId);
    });
    const setMute = (mute, userId) => {
      const clientIdx = clientsRef.current
        .map((client) => client._id)
        .indexOf(userId);
      const connectedClients = clientsRef.current;
      if (clientIdx > -1) {
        connectedClients[clientIdx].muted = mute;
        setClients(connectedClients);
      }

      return (
        () => socket.current.off(ACTIONS.MUTE),
        socket.current.off(ACTIONS.UN_MUTEMUTE)
      );
    };
  }, []);

  // ✅ REFERENCE TO <audio> ELEMENT
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  // handling mute
  const handleMute = (isMute, userId) => {
    let settled = false;
    let interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !isMute;
        if (isMute) {
          socket.current.emit(ACTIONS.MUTE, { roomId, userId });
        } else {
          socket.current.emit(ACTIONS.UN_MUTE, { roomId, userId });
        }
        settled = true;
      }
      if (settled) {
        clearInterval(interval);
      }
    }, 200);
  };

  return { clients, provideRef, handleMute };
};

export default useWebRTC;
