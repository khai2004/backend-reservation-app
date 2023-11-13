import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Hotel',
    },
    rooms: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Room',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Hotel', HotelSchema);
