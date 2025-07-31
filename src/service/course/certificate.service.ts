import mongoose from 'mongoose';
import Certificate, { ICertificate } from '../../models/course/certificate.schema';
import CustomError from '../../utils/custom.error';

interface CertificateInput {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  certificateUrl: string;
  issuedAt?: Date;
}

class CertificateService {
  async issueCertificate(data: CertificateInput): Promise<ICertificate> {
    return await Certificate.create({
      ...data,
      issuedAt: data.issuedAt || new Date(),
    });
  }

  async getAllCertificates(): Promise<ICertificate[]> {
    return await Certificate.find().populate('user').populate('course');
  }

  async getCertificateById(id: string): Promise<ICertificate> {
    const certificate = await Certificate.findById(id).populate('user').populate('course');
    if (!certificate) throw new CustomError('Certificate not found', 404);
    return certificate;
  }

  async getCertificatesByUser(userId: string): Promise<ICertificate[]> {
    return await Certificate.find({ user: userId }).populate('course');
  }

  async deleteCertificate(id: string): Promise<void> {
    const deleted = await Certificate.findByIdAndDelete(id);
    if (!deleted) throw new CustomError('Certificate not found', 404);
  }
}

export default new CertificateService();
