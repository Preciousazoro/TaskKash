import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import { KYC, createKYC } from '@/models/KYC';

// Configure Cloudinary
console.log('KYC API - Cloudinary config check:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
  api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

async function uploadToCloudinary(file: File, folder: string = 'kyc-documents'): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const dataURI = `data:${file.type};base64,${base64}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      dataURI,
      {
        folder,
        resource_type: 'auto',
        format: 'jpg',
        quality: 'auto:good',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const userId = formData.get('userId') as string;
    const username = formData.get('username') as string;
    const userEmail = formData.get('userEmail') as string;
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const dob = formData.get('dob') as string;
    const nationality = formData.get('nationality') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const country = formData.get('country') as string;
    const postalCode = formData.get('postalCode') as string;
    
    const idType = formData.get('idType') as string;
    const idNumber = formData.get('idNumber') as string;
    
    const frontImage = formData.get('frontImage') as File;
    const backImage = formData.get('backImage') as File;

    // Log received data for debugging
    console.log('KYC API - Received data:', {
      userId: formData.get('userId'),
      username: formData.get('username'),
      userEmail: formData.get('userEmail'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      dob: formData.get('dob'),
      nationality: formData.get('nationality'),
      address: formData.get('address'),
      city: formData.get('city'),
      country: formData.get('country'),
      postalCode: formData.get('postalCode'),
      idType: formData.get('idType'),
      idNumber: formData.get('idNumber'),
      frontImage: formData.get('frontImage') instanceof File ? 'File present' : 'No file',
      backImage: formData.get('backImage') instanceof File ? 'File present' : 'No file',
    });

    // Validate required fields
    if (!userId || !username || !userEmail || !firstName || !lastName || !dob || 
        !nationality || !address || !city || !country || !postalCode || 
        !idType || !idNumber || !frontImage || !backImage) {
      console.log('KYC API - Missing fields:', {
        userId: !!userId,
        username: !!username,
        userEmail: !!userEmail,
        firstName: !!firstName,
        lastName: !!lastName,
        dob: !!dob,
        nationality: !!nationality,
        address: !!address,
        city: !!city,
        country: !!country,
        postalCode: !!postalCode,
        idType: !!idType,
        idNumber: !!idNumber,
        frontImage: !!frontImage,
        backImage: !!backImage,
      });
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(frontImage.type) || frontImage.size > maxSize) {
      return NextResponse.json(
        { error: 'Invalid front image file. Only JPG, PNG or PDF files under 5MB are allowed' },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(backImage.type) || backImage.size > maxSize) {
      return NextResponse.json(
        { error: 'Invalid back image file. Only JPG, PNG or PDF files under 5MB are allowed' },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    console.log('KYC API - Starting Cloudinary upload...');
    let frontImageUrl: string, backImageUrl: string;
    try {
      [frontImageUrl, backImageUrl] = await Promise.all([
        uploadToCloudinary(frontImage, 'kyc-documents/front'),
        uploadToCloudinary(backImage, 'kyc-documents/back')
      ]);
      console.log('KYC API - Cloudinary upload successful:', { frontImageUrl, backImageUrl });
    } catch (uploadError) {
      console.error('KYC API - Cloudinary upload failed:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload images. Please try again.' },
        { status: 500 }
      );
    }

    // Create KYC record
    const kycData = createKYC({
      userId: new ObjectId(userId),
      username,
      userEmail,
      firstName,
      lastName,
      dob,
      nationality,
      address,
      city,
      country,
      postalCode,
      idType,
      idNumber,
      frontImage: frontImageUrl,
      backImage: backImageUrl,
    });

    // Save to database
    await client.connect();
    const kycCollection = db.collection('kyc');
    
    // Check if user already has a pending or approved KYC
    const existingKYC = await kycCollection.findOne({
      userId: new ObjectId(userId),
      status: { $in: ['pending', 'approved'] }
    });

    if (existingKYC) {
      return NextResponse.json(
        { error: 'You already have a KYC submission pending or approved' },
        { status: 400 }
      );
    }

    const kycRecord: KYC = {
      ...kycData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    const result = await kycCollection.insertOne(kycRecord);

    await client.close();

    return NextResponse.json({
      success: true,
      message: 'KYC submitted successfully',
      submissionId: kycRecord.submissionId,
      kycId: result.insertedId.toString(),
    });

  } catch (error) {
    console.error('KYC submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit KYC. Please try again.' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await client.connect();
    const kycCollection = db.collection('kyc');

    const kycRecord = await kycCollection.findOne(
      { userId: new ObjectId(userId) },
      { sort: { createdAt: -1 } } // Get the most recent KYC submission
    );

    await client.close();

    if (!kycRecord) {
      return NextResponse.json(
        { error: 'No KYC submission found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      kyc: {
        id: kycRecord._id?.toString(),
        submissionId: kycRecord.submissionId,
        status: kycRecord.status,
        createdAt: kycRecord.createdAt,
        updatedAt: kycRecord.updatedAt,
        rejectionReason: kycRecord.rejectionReason,
      }
    });

  } catch (error) {
    console.error('KYC retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve KYC status' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
