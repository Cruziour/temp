import React, { useState } from 'react';
import { createRoomService } from '../../../services/index.js';
import { useNavigate } from 'react-router-dom';

const AddRoomModel = ({ onClose }) => {
  const [roomType, setRoomType] = useState('open');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  const createRoom = async () => {
    if ([topic, description].some((data) => data.trim() == '')) return;
    // server call
    try {
      const { data } = await createRoomService({
        topic,
        description,
        roomType,
      });
      navigate(`/room/${data?._id}`);
    } catch (error) {
      console.log(error, 'addRoomModel');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#110d0d76] flex justify-center items-center">
      <div className="w-[50%] max-w-[500px] bg-[#1d1d1d] rounded-4xl p-10 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-3 cursor-pointer"
        >
          <img src="/images/close.png" alt="close" />
        </button>
        <div className=" border-b text-center pb-8">
          {/* model header  */}
          <h3 className="text-lg font-bold">
            Enter the title & description to be disscussed.
          </h3>
          <input
            type="text"
            className="w-[100%] py-1 px-4 mt-4 border rounded-4xl"
            placeholder="Enter Room Title"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <input
            type="text"
            className="w-[100%] py-1 px-4 mt-4 border rounded-4xl"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="text-start mt-4">
            <h3 className="text-lg font-semibold">Room Types</h3>
          </div>
          <div className="flex justify-between mt-4">
            {/* types of room  */}
            <div
              onClick={() => setRoomType('open')}
              className={`bg-[#262626] rounded-4xl w-[8vw] h-[18vh] flex flex-col justify-center items-center ${
                roomType === 'open' ? 'border-2 border-blue-600' : ''
              }`}
            >
              <img src="/images/globe.png" alt="globe" />
              <span>Open</span>
            </div>
            <div
              onClick={() => setRoomType('social')}
              className={`bg-[#262626] rounded-4xl w-[8vw] h-[18vh] flex flex-col justify-center items-center ${
                roomType === 'social' ? 'border-2 border-blue-600' : ''
              }`}
            >
              <img src="/images/social.png" alt="social" />
              <span>Social</span>
            </div>
            <div
              onClick={() => setRoomType('private')}
              className={`bg-[#262626] rounded-4xl w-[8vw] h-[18vh] flex flex-col justify-center items-center ${
                roomType === 'private' ? 'border-2 border-blue-600' : ''
              }`}
            >
              <img src="/images/lock.png" alt="lock" />
              <span>Private</span>
            </div>
          </div>
        </div>
        <div className="text-center pt-4">
          {/* model footer  */}
          <h2 className="text-lg font-semibold">
            Start a room, open to everyone.
          </h2>
          <div className="flex justify-center items-center mt-2">
            <button
              onClick={createRoom}
              className="flex justify-center items-center gap-x-2 py-2 px-14 bg-[#4432baee] hover:bg-[#4f518de4] hover:duration-300 rounded-4xl"
            >
              <img src="/images/celebration.png" alt="celebration" />
              <span className="text-lg font-semibold">Let's go</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModel;
