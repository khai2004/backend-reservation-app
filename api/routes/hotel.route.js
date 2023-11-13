import express from 'express';
import {
  getHotels,
  createHotel,
  getSingleHotel,
  deleteHotel,
  updateHotel,
  getTopHotels,
  getHotelsRating,
  getHotelType,
  getHotelRooms,
} from '../controllers/hotel.js';
const router = express.Router();
import { admin, protect } from '../middleware/authMiddleware.js';

router.route('/').get(getHotels).post(protect, admin, createHotel);
router.get('/top', protect, getTopHotels);
router.get('/rating', getHotelsRating);
router.get('/type', getHotelType);
router
  .route('/:id')
  .get(getSingleHotel)
  .put(protect, admin, updateHotel)
  .delete(protect, admin, deleteHotel);
router.get('/rooms/:hotelid', protect, admin, getHotelRooms);
export default router;
