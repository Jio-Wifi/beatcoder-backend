import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import CategoryService from '../../service/course/category.service';

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.createCategory(req.body);
  res.status(201).json({ message: 'Category created successfully', category });
});

export const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await CategoryService.getAllCategories();
  res.status(200).json({ categories });
});

export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.getCategoryById(req.params.id);
  res.status(200).json({ category });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const updated = await CategoryService.updateCategory(req.params.id, req.body);
  res.status(200).json({ message: 'Category updated successfully', updated });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await CategoryService.deleteCategory(req.params.id);
  res.status(200).json({ message: 'Category deleted successfully' });
});
