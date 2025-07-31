import express from 'express';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { createCategoryValidation } from '../../validations/course/category/create.category.validation';
import { validateRequest } from '../../middleware/validation.middleware';
import { authorizeRoles } from '../../middleware/authorize.role';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../../controllers/course/category.controller';
import { updateCategoryValidation } from '../../validations/course/category/update.category.validation';
import { deleteCategoryValidation } from '../../validations/course/category/delete.category.validation';

const categoryRoutes = express.Router();

categoryRoutes.post(
  '/',
  isAuthenticate,
  authorizeRoles('admin'),
  createCategoryValidation,
  validateRequest,
  createCategory
);

categoryRoutes.get('/', getAllCategories);
categoryRoutes.get('/:id', getCategoryById);

categoryRoutes.put(
  '/:id',
  isAuthenticate,
  authorizeRoles('admin'),
  updateCategoryValidation,
  validateRequest,
  updateCategory
);

categoryRoutes.delete(
  '/:id',
  isAuthenticate,
  authorizeRoles('admin'),
  deleteCategoryValidation,
  validateRequest,
  deleteCategory
);

export default categoryRoutes;
