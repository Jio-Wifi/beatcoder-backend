import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import CertificateService from '../../service/course/certificate.service';

export const issueCertificate = catchAsync(async (req: Request, res: Response) => {
  const certificate = await CertificateService.issueCertificate(req.body);
  res.status(201).json({ message: 'Certificate issued', certificate });
});

export const getAllCertificates = catchAsync(async (_req: Request, res: Response) => {
  const certificates = await CertificateService.getAllCertificates();
  res.status(200).json({ certificates });
});

export const getCertificateById = catchAsync(async (req: Request, res: Response) => {
  const certificate = await CertificateService.getCertificateById(req.params.id);
  res.status(200).json({ certificate });
});

export const getCertificatesByUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const certificates = await CertificateService.getCertificatesByUser(userId);
  res.status(200).json({ certificates });
});

export const deleteCertificate = catchAsync(async (req: Request, res: Response) => {
  await CertificateService.deleteCertificate(req.params.id);
  res.status(200).json({ message: 'Certificate deleted' });
});
