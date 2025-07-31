// import { Request, Response } from 'express';
// import catchAsync from '../../utils/catch.async';
// import EnrollmentService from '../../service/course/enrollement.service';

// export const enroll = catchAsync(async (req: Request, res: Response) => {
//   const enrollment = await EnrollmentService.enroll(req.body);
//   res.status(201).json({ message: 'Enrolled successfully', enrollment });
// });

// export const getAllEnrollments = catchAsync(async (_req: Request, res: Response) => {
//   const enrollments = await EnrollmentService.getAllEnrollments();
//   res.status(200).json({ enrollments });
// });

// export const getEnrollmentById = catchAsync(async (req: Request, res: Response) => {
//   const enrollment = await EnrollmentService.getEnrollmentById(req.params.id);
//   res.status(200).json({ enrollment });
// });

// export const deleteEnrollment = catchAsync(async (req: Request, res: Response) => {
//   await EnrollmentService.deleteEnrollment(req.params.id);
//   res.status(200).json({ message: 'Enrollment deleted successfully' });
// });
