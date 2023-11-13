import express from 'express';
import {
  register,
  authUser,
  getUser,
  getUsers,
  updatUser,
  deleteUser,
  logoutUser,
} from '../controllers/user.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.route('/login').post(authUser);
router.post('/logout', logoutUser);
router.get('/users', protect, admin, getUsers);
router
  .route('/users/:id')
  .get(protect, getUser)
  .put(protect, updatUser)
  .delete(protect, deleteUser);

export default router;
