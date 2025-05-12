import React, { useEffect, useState } from 'react';
import RoomCard from '../../components/shared/RoomCard/RoomCard';
import AddRoomModel from '../../components/shared/AddRoomModel/AddRoomModel';
import { getAllRoomService } from '../../services';

const Rooms = () => {
  const [showModel, setShowModel] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await getAllRoomService({ roomType: 'open' });
      setRooms(data);
    })();
  }, []);

  const openModel = () => {
    setShowModel((prev) => !prev);
  };
  return (
    <>
      <div className="ml-20 mr-20 mt-6">
        {/* rooms header  */}
        <div>
          <div className="flex justify-between">
            <div className="flex justify-center items-center gap-x-4">
              <div className="rounded-4xl pb-1 w-40 border-b-4 border-blue-600 flex justify-center items-center">
                <span className="text-lg font-semibold ">All rooms</span>
              </div>
              <div className="relative">
                <img
                  src="/images/search-icon.png"
                  alt="search"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input
                  type="text"
                  placeholder="Search rooms"
                  className="pl-10 pr-4 pt-2 pb-1 border-b-4 border-amber-500 rounded-4xl focus:outline-none w-[25vw]"
                />
              </div>
            </div>
            <div>
              <button
                className="flex cursor-pointer justify-center items-center gap-x-2 border-b-4 w-[10vw] border-blue-700 rounded-4xl pb-1 "
                onClick={openModel}
              >
                <img src="/images/add-room-icon.png" alt="add-room" />
                <span>Start a room</span>
              </button>
            </div>
          </div>
          {/* list room */}
          <div></div>
        </div>
        {/* list of rooms  */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto hide-scrollbar max-h-[76vh] min-h-[76vh]">
          {rooms?.map((room) => (
            <RoomCard room={room} key={room?._id} />
          ))}
        </div>
      </div>
      {showModel && <AddRoomModel onClose={() => setShowModel(false)} />}
    </>
  );
};

export default Rooms;
