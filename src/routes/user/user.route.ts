import express from 'express';
import { profileValidation} from '../../validations/user/profile.validation';
import { validateRequest } from '../../middleware/validation.middleware';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { deleteUser, getAllUsers, getProfile, getUserById, getUserNameById, updateProfile, updateUser } from '../../controllers/user/user.controller';
import { updateProfileValidation } from '../../validations/user/update.profile.validation';
import { authorizeRoles } from '../../middleware/authorize.role';
import { validateUpdateUser, validateUserId } from '../../validations/course/user/user.validation';

const userRoutes = express.Router();

userRoutes.get('/profile',  isAuthenticate,profileValidation, validateRequest,getProfile);
userRoutes.patch('/profile',  isAuthenticate, updateProfileValidation, validateRequest,updateProfile);
userRoutes.delete('/profile',  isAuthenticate,profileValidation, validateRequest,deleteUser);


// admin route

// Get all users (Admin only)
userRoutes.get(
  "/",
  isAuthenticate,
  authorizeRoles("admin"),
  getAllUsers
);

// Get single user by ID (Admin only)
userRoutes.get(
  "/:id",
  isAuthenticate,
  authorizeRoles("admin"),
  validateUserId,
  validateRequest,
  getUserById
);

// Update user (Admin only)
userRoutes.put(
  "/:id",
  isAuthenticate,
  authorizeRoles("admin"),
  validateUserId,
  validateUpdateUser,
  validateRequest,
  updateUser
);

// Delete user (Admin only)
userRoutes.delete(
  "/:id",
  isAuthenticate,
  authorizeRoles("admin"),
  validateUserId,
  validateRequest,
  deleteUser
);

//public route 

userRoutes.get('/:userId/name', getUserNameById);

export default userRoutes;
