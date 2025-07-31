import express from 'express';
import { registerValidation } from '../../validations/auth/register.validation';
import { validateRequest } from '../../middleware/validation.middleware';
import { loginValidation } from '../../validations/auth/login.validation';
import { isAuthenticate } from '../../middleware/is.authenticate';
import {
  login,
  logout,
  refreshToken,
  register,
  forgotPassword,
  changePassword,
} from '../../controllers/auth/auth.controller';

const authRoutes = express.Router();

// Register a new user
authRoutes.post('/register', registerValidation, validateRequest, register);

// Refresh access token using refresh token
authRoutes.post('/refresh', refreshToken);

// Login
authRoutes.post('/login', loginValidation, validateRequest, login);

// Logout (protected route)
authRoutes.post('/logout', isAuthenticate, logout);

// Forgot password (send reset email)
authRoutes.post('/forgot-password', forgotPassword);

// Change password using reset token
authRoutes.post('/change-password', changePassword);

export default authRoutes;
