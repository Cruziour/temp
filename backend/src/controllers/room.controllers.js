import { Room } from '../models/room.model.js';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';

const createRoom = asyncHandler(async (req, res) => {
  const { topic, description, roomType } = req.body;
  if (
    [topic, description, roomType].some((data) => !data || data.trim() === '')
  ) {
    throw new ApiError(400, 'Please fill in all fields...');
  }

  try {
    const roomData = {
      topic,
      description,
      roomType,
      creator: req.user?._id,
      speakers: [req.user?._id],
    };
    const room = await Room.create(roomData);
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }
    return res
      .status(201)
      .json(new ApiResponse(201, room, 'Suucessfuuly create room'));
  } catch (error) {
    throw new ApiError(500, 'Internal Server Error');
  }
});

const getAllExistingRoom = asyncHandler(async (req, res) => {
  const { roomType } = req.body;

  if (!roomType) {
    throw new ApiError(400, 'Please fill in room type...');
  }

  try {
    const rooms = await Room.aggregate([
      {
        $match: { roomType },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $unwind: {
          path: '$creator',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'speakers',
          foreignField: '_id',
          as: 'speakers',
        },
      },
      {
        $project: {
          topic: 1,
          description: 1,
          roomType: 1,
          createdAt: 1,
          updatedAt: 1,
          creator: {
            _id: 1,
            name: 1,
            avatar: 1,
            phone: 1,
            activated: 1,
          },
          speakers: {
            $map: {
              input: '$speakers',
              as: 'speaker',
              in: {
                _id: '$$speaker._id',
                name: '$$speaker.name',
                avatar: '$$speaker.avatar',
                phone: '$$speaker.phone',
                activated: '$$speaker.activated',
              },
            },
          },
        },
      },
    ]);

    if (!rooms.length) {
      throw new ApiError(404, 'Room not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, rooms, 'Successfully fetched rooms'));
  } catch (error) {
    throw new ApiError(500, 'Internal Server Error');
  }
});

export { createRoom, getAllExistingRoom };
