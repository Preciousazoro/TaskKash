import { ObjectId } from 'mongodb';

export interface KYC {
  _id?: ObjectId;
  userId: ObjectId;
  username: string;
  userEmail: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  
  // ID Verification
  idType: string;
  idNumber: string;
  frontImage: string; // Cloudinary URL
  backImage: string; // Cloudinary URL
  
  // Status and Metadata
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  rejectionReason?: string;
  submissionId: string; // Unique submission ID
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: ObjectId; // Admin who reviewed
  
  // Additional metadata
  ipAddress?: string;
  userAgent?: string;
}

export const createKYC = (kycData: {
  userId: ObjectId;
  username: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  idType: string;
  idNumber: string;
  frontImage: string;
  backImage: string;
}): Omit<KYC, '_id' | 'createdAt' | 'updatedAt' | 'reviewedAt' | 'reviewedBy' | 'rejectionReason' | 'status' | 'ipAddress' | 'userAgent'> => {
  return {
    userId: kycData.userId,
    username: kycData.username,
    userEmail: kycData.userEmail,
    firstName: kycData.firstName,
    lastName: kycData.lastName,
    dob: kycData.dob,
    nationality: kycData.nationality,
    address: kycData.address,
    city: kycData.city,
    country: kycData.country,
    postalCode: kycData.postalCode,
    idType: kycData.idType,
    idNumber: kycData.idNumber,
    frontImage: kycData.frontImage,
    backImage: kycData.backImage,
    submissionId: `KYC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  };
};
