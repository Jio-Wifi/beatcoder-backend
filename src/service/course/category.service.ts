import slugify from 'slugify';
import Category, { ICategory } from '../../models/course/category.schema';
import CustomError from '../../utils/custom.error';
import mongoose from 'mongoose';

interface CategoryData {
  name: string;
  slug: string;
}

class CategoryService {
async createCategory(data: CategoryData): Promise<ICategory> {
  // Auto-generate slug if not provided
  if (!data.slug) {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }

  // Check for duplicate slug
  const existing = await Category.findOne({ slug: data.slug });
  if (existing) {
    throw new CustomError("Category with this slug already exists", 409);
  }

  return await Category.create(data);
}
  async getAllCategories(): Promise<ICategory[]> {
    return await Category.find();
  }

  async getCategoryById(id: string): Promise<ICategory> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid category ID', 400);
    }

    const category = await Category.findById(id);
    if (!category) throw new CustomError('Category not found', 404);
    return category;
  }

  async updateCategory(id: string, updates: Partial<CategoryData>): Promise<ICategory> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid category ID', 400);
    }

    const updated = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) throw new CustomError('Category not found', 404);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid category ID', 400);
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) throw new CustomError('Category not found', 404);
  }
}

export default new CategoryService();
