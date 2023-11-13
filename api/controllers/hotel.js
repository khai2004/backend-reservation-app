import asyncHandler from '../middleware/asyncHandler.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

export const getHotels = asyncHandler(async (req, res) => {
  const count = await Hotel.countDocuments({});
  const pageSize = Number(req.query.pageSize) || 5;

  const totalPage = Math.ceil(count / pageSize);
  const page = Number(req.query.pageNumber) || 1;
  const skip = (page - 1) * pageSize || 0;
  const filter = {};
  let price = 1;

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.price) {
    price = req.query.price;
  }

  if (req.query.rating) {
    const max = Number(req.query.rating) + 1;
    filter.rating = {
      $gte: Number(req.query.rating),
      $lt: Number(max),
    };
  }

  if (req.query.city) {
    const citySearch = new RegExp(req.query.city, 'i');
    filter.city = citySearch;
  }

  const hotels = await Hotel.find(filter)
    .skip(skip)
    .limit(pageSize)
    .sort({ cheapestPrice: price });

  if (hotels) {
    res.status(200).json({ hotels, totalPage: totalPage });
  } else {
    res.status(400);
    throw new Error('Something wrong');
  }
});

export const getSingleHotel = asyncHandler(async (req, res) => {
  const singelHotel = await Hotel.findById(req.params.id);
  if (singelHotel) {
    res.status(200).json(singelHotel);
  } else {
    res.status(400);
    throw new Error('Something wrong');
  }
});

export const createHotel = asyncHandler(async (req, res) => {
  const newHotel = new Hotel(req.body);
  const savedHotel = await newHotel.save();
  if (savedHotel) {
    res.status(200).json(savedHotel);
  } else {
    res.status(400);
    throw new Error('Invalid User data');
  }
});

export const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  const roomDelete = await Promise.all(
    hotel.rooms.map((room) => {
      return Room.findByIdAndDelete(room);
    })
  );
  const imageId = hotel.photo.map((pho) => pho.public_id);

  if (!imageId.length === 0) {
    const result = await cloudinary.api.delete_resources(imageId);
    console.log(result);
  }

  const singelHotel = await Hotel.findByIdAndDelete(req.params.id);

  if (singelHotel && roomDelete) {
    res.status(200).json({ message: 'Deleted success' });
  } else {
    res.status(400);
    throw new Error('Something wrong');
  }
});

export const updateHotel = asyncHandler(async (req, res) => {
  const updateHotel = await Hotel.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  if (updateHotel) {
    console.log(updateHotel);
    res.status(200).json(updateHotel);
  } else {
    res.status(400);
    throw new Error('Something wrong');
  }
});

export const getTopHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({}).sort({ rating: -1 }).limit(4);
  res.status(200).json(hotels);
});

export const getHotelsRating = asyncHandler(async (req, res) => {
  const rating = [];

  for (let i = 1; i < 6; i++) {
    const count = await Hotel.countDocuments({
      rating: { $gte: Number(i), $lt: Number(i + 1) },
    });
    rating.push(count);
  }
  if (rating) {
    res.status(200).json(rating);
  } else {
    res.status(400);
    throw new Error('Something wrong');
  }
});

export const getHotelType = asyncHandler(async (req, res) => {
  const pipeline = [
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ];

  const result = await Hotel.aggregate(pipeline);

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400);
    throw new Error('Something wrong');
  }
});

export const getHotelRooms = asyncHandler(async (req, res) => {
  const hotelRooms = await Hotel.findById({ _id: req.params.hotelid });
  const roomId = hotelRooms.rooms;
  const rooms = await Promise.all(
    roomId.map((room) => {
      return Room.findById(room);
    })
  );
  if (rooms) {
    res.status(200).json(rooms);
  } else {
    res.status(400);
    throw new Error('Something went wrong');
  }
});
