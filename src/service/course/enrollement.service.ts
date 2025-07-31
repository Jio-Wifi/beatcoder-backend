// import mongoose from 'mongoose';
// import Enrollment, { IEnrollment } from '../../models/course/enrollment.schema';
// import CustomError from '../../utils/custom.error';

// interface EnrollmentData {
//   user: mongoose.Types.ObjectId;
//   course: mongoose.Types.ObjectId;
// }

// class EnrollmentService {
//   async enroll(data: EnrollmentData): Promise<IEnrollment> {
//     const existing = await Enrollment.findOne({
//       user: data.user,
//       course: data.course,
//     });

//     if (existing) {
//       throw new CustomError('User is already enrolled in this course', 409);
//     }

//     return await Enrollment.create(data);
//   }

//   async getAllEnrollments(): Promise<IEnrollment[]> {
//     return await Enrollment.find().populate('user').populate('course');
//   }

//   async getEnrollmentById(id: string): Promise<IEnrollment> {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       throw new CustomError('Invalid enrollment ID', 400);
//     }

//     const enrollment = await Enrollment.findById(id).populate('user').populate('course');
//     if (!enrollment) {
//       throw new CustomError('Enrollment not found', 404);
//     }

//     return enrollment;
//   }

//   async deleteEnrollment(id: string): Promise<void> {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       throw new CustomError('Invalid enrollment ID', 400);
//     }

//     const deleted = await Enrollment.findByIdAndDelete(id);
//     if (!deleted) {
//       throw new CustomError('Enrollment not found', 404);
//     }
//   }
// }

// export default new EnrollmentService();
