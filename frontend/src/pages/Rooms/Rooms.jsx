import React from 'react';
import RoomCard from '../../components/shared/RoomCard/RoomCard';

const rooms = [
  {
    id: 1,
    topic: 'Which framework best for frontend?',
    creator: {
      _id: 1,
      name: 'Rohan K',
      avatar: '/images/monkey-avatar.png',
      description: 'Frontend developer exploring modern web frameworks.',
    },
    speakers: [
      {
        id: 1,
        name: 'John Doe',
        avatar: '/images/monkey-avatar.png',
      },
      {
        id: 2,
        name: 'Jane Doe',
        avatar: '/images/monkey-avatar.png',
      },
    ],
    totalPeople: 40,
  },
  {
    id: 2,
    topic: 'Why people use stack overflow?',
    creator: {
      _id: 2,
      name: 'Alice Johnson',
      avatar: '/images/monkey-avatar.png',
      description: 'Tech blogger and Stack Overflow enthusiast.',
    },
    speakers: [
      {
        id: 3,
        name: 'Alice Johnson',
        avatar: '/images/monkey-avatar.png',
      },
      {
        id: 4,
        name: 'Bob Smith',
        avatar: '/images/monkey-avatar.png',
      },
    ],
    totalPeople: 38,
  },
  {
    id: 3,
    topic: 'What’s new in machine learning?',
    creator: {
      _id: 3,
      name: 'Dr. A. Kumar',
      avatar: '/images/monkey-avatar.png',
      description: 'ML researcher and university professor.',
    },
    speakers: [
      {
        id: 5,
        name: 'Dr. A. Kumar',
        avatar: '/images/monkey-avatar.png',
      },
      {
        id: 6,
        name: 'Sarah Lee',
        avatar: '/images/monkey-avatar.png',
      },
    ],
    totalPeople: 52,
  },
  {
    id: 4,
    topic: 'Artificial intelligence is the future?',
    creator: {
      _id: 4,
      name: 'Elon Dusk',
      avatar: '/images/monkey-avatar.png',
      description: 'Futurist and AI startup founder.',
    },
    speakers: [
      {
        id: 7,
        name: 'Elon Dusk',
        avatar: '/images/monkey-avatar.png',
      },
      {
        id: 8,
        name: 'Techie Tom',
        avatar: '/images/monkey-avatar.png',
      },
    ],
    totalPeople: 45,
  },
  {
    id: 5,
    topic: 'How to start with open source?',
    creator: {
      _id: 5,
      name: 'Open Dev',
      avatar: '/images/monkey-avatar.png',
      description: 'Open source contributor and mentor.',
    },
    speakers: [
      {
        id: 9,
        name: 'Open Dev',
        avatar: '/images/monkey-avatar.png',
      },
      {
        id: 10,
        name: 'Contributor X',
        avatar: '/images/monkey-avatar.png',
      },
    ],
    totalPeople: 30,
  },
  {
    id: 6,
    topic: 'Which framework best for frontend?',
    creator: {
      _id: 1,
      name: 'Rohan K',
      avatar: '/images/monkey-avatar.png',
      description: 'Frontend developer exploring modern web frameworks.',
    },
    speakers: [
      {
        id: 1,
        name: 'John Doe',
        avatar: '/images/monkey-avatar.png',
      },
      {
        id: 2,
        name: 'Jane Doe',
        avatar: '/images/monkey-avatar.png',
      },
    ],
    totalPeople: 40,
  },
  {
    id: 7,
    topic: 'Why people use stack overflow?',
    creator: {
      _id: 2,
      name: 'Alice Johnson',
      avatar: '/images/monkey-avatar.png',
      description: 'Tech blogger and Stack Overflow enthusiast.',
    },
    speakers: [
      {
        id: 3,
        name: 'Alice Johnson',
        avatar: '/images/monkey-avatar.png',
      },
      {
        id: 4,
        name: 'Bob Smith',
        avatar: '/images/monkey-avatar.png',
      },
    ],
    totalPeople: 38,
  },
  {
    id: 8,
    topic: 'What’s new in machine learning?',
    creator: {
      _id: 3,
      name: 'Dr. A. Kumar',
      avatar: '/images/monkey-avatar.png',
      description: 'ML researcher and university professor.',
    },
    speakers: [
      {
        id: 5,
        name: 'Dr. A. Kumar',
        avatar: '/images/monkey-avatar.png',
      },
      {
        id: 6,
        name: 'Sarah Lee',
        avatar: '/images/monkey-avatar.png',
      },
    ],
    totalPeople: 52,
  },
  {
    id: 9,
    topic: 'Artificial intelligence is the future?',
    creator: {
      _id: 4,
      name: 'Elon Dusk',
      avatar: '/images/monkey-avatar.png',
      description: 'Futurist and AI startup founder.',
    },
    speakers: [
      {
        id: 7,
        name: 'Elon Dusk',
        avatar: '/images/monkey-avatar.png',
      },
      {
        id: 8,
        name: 'Techie Tom',
        avatar: '/images/monkey-avatar.png',
      },
    ],
    totalPeople: 45,
  },
  {
    id: 10,
    topic: 'How to start with open source?',
    creator: {
      _id: 5,
      name: 'Open Dev',
      avatar: '/images/monkey-avatar.png',
      description: 'Open source contributor and mentor.',
    },
    speakers: [
      {
        id: 9,
        name: 'Open Dev',
        avatar: '/images/monkey-avatar.png',
      },
      {
        id: 10,
        name: 'Contributor X',
        avatar: '/images/monkey-avatar.png',
      },
    ],
    totalPeople: 30,
  },
];

const Rooms = () => {
  return (
    <div className="ml-20 mr-20 mt-6">
      {/* rooms header  */}
      <div className="">
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
            <button className="flex justify-center items-center gap-x-2 border-b-4 w-[10vw] border-blue-700 rounded-4xl pb-1 ">
              <img src="/images/add-room-icon.png" alt="add-room" />
              <span>Start a room</span>
            </button>
          </div>
        </div>
        {/* list room */}
        <div></div>
      </div>
      {/* list of rooms  */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto hide-scrollbar max-h-[76vh]">
        {rooms?.map((room) => (
          <RoomCard room={room} key={room.id} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;
