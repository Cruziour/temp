import { useCallback, useEffect, useRef } from 'react';
import useStateWithCallback from './useStateWithCallBack';

const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);

  // Add new clients - FIXED: using functional update to avoid stale closure
  const addNewClients = useCallback(
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

        addNewClients(user, () => {
          const localElement = audioElements.current[user._id];
          if (localElement) {
            localElement.volume = 0; // mute local mic playback
            localElement.srcObject = localMediaStream.current;
          }
        });
      } catch (error) {
        console.error('Could not get user media:', error);
      }
    };

    startCapture();
  }, [user, addNewClients]);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  return { clients, provideRef };
};

export default useWebRTC;
