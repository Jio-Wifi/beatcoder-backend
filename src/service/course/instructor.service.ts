import mongoose from 'mongoose';
import Instructor, { IInstructor } from '../../models/course/instructor.schema';
import CustomError from '../../utils/custom.error';

interface InstructorInput {
  user: mongoose.Types.ObjectId;
  bio: string;
  expertise: string[];
}

class InstructorService {
  async createInstructor(data: InstructorInput): Promise<IInstructor> {
    return await Instructor.create(data);
  }

  async getAllInstructors(): Promise<IInstructor[]> {
    return await Instructor.find()
    .populate('user', 'name email') 
    .populate('courses', 'title');  
  }

  async getInstructorById(id: string): Promise<IInstructor> {
    const instructor = await Instructor.findById(id).populate('user');
    if (!instructor) throw new CustomError('Instructor not found', 404);
    return instructor;
  }

  async updateInstructor(id: string, updates: Partial<InstructorInput>): Promise<IInstructor> {
    const updated = await Instructor.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('user');

    if (!updated) throw new CustomError('Instructor not found', 404);
    return updated;
  }

  async deleteInstructor(id: string): Promise<void> {
    const deleted = await Instructor.findByIdAndDelete(id);
    if (!deleted) throw new CustomError('Instructor not found', 404);
  }
}

export default new InstructorService();
