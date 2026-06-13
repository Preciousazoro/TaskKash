import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST - Create new campaign
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user is admin
    // You may need to add role check here based on your auth system

    await connectDB();

    const formData = await request.formData();

    // Extract form fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const creatorName = formData.get('creatorName') as string;
    const platform = formData.get('platform') as string;
    const campaignType = formData.get('campaignType') as string;
    const mediaUrl = formData.get('mediaUrl') as string;
    const reward = parseInt(formData.get('reward') as string);
    const totalBudget = parseInt(formData.get('totalBudget') as string);
    const completionType = formData.get('completionType') as string;
    const requiredDuration = formData.get('requiredDuration') ? parseInt(formData.get('requiredDuration') as string) : undefined;
    const requiredPercentage = formData.get('requiredPercentage') ? parseInt(formData.get('requiredPercentage') as string) : undefined;
    const allowSkipping = formData.get('allowSkipping') === 'yes';
    const countPaused = formData.get('countPaused') === 'yes';
    const repeatLimit = parseInt(formData.get('repeatLimit') as string);
    const status = formData.get('status') as string;
    const totalDuration = formData.get('totalDuration') ? parseInt(formData.get('totalDuration') as string) : undefined;

    // Handle file uploads
    let thumbnailUrl = formData.get('thumbnailUrl') as string;
    let thumbnailPublicId = formData.get('thumbnailPublicId') as string;
    let creatorAvatar = formData.get('creatorAvatar') as string;
    let coverArt = formData.get('coverArt') as string;
    let coverArtPublicId = formData.get('coverArtPublicId') as string;

    // Upload thumbnail if file provided
    const thumbnailFile = formData.get('thumbnailFile') as File;
    if (thumbnailFile && thumbnailFile.size > 0) {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'taskkash/campaign-thumbnails',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      thumbnailUrl = (result as any).secure_url;
      thumbnailPublicId = (result as any).public_id;
    }

    // Upload creator avatar if file provided
    const avatarFile = formData.get('avatarFile') as File;
    if (avatarFile && avatarFile.size > 0) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'taskkash/campaign-avatars',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      creatorAvatar = (result as any).secure_url;
    }

    // Upload cover art if file provided
    const coverArtFile = formData.get('coverArtFile') as File;
    if (coverArtFile && coverArtFile.size > 0) {
      const buffer = Buffer.from(await coverArtFile.arrayBuffer());
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'taskkash/campaign-cover-art',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      coverArt = (result as any).secure_url;
      coverArtPublicId = (result as any).public_id;
    }

    // Generate embed URL based on platform and media URL
    let embedUrl: string | undefined;
    if (mediaUrl) {
      if (platform === 'youtube' && mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
        const videoId = mediaUrl.includes('youtu.be')
          ? mediaUrl.split('/').pop()
          : new URL(mediaUrl).searchParams.get('v');
        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
          // Auto-extract YouTube thumbnail if no thumbnail uploaded
          if (!thumbnailUrl) {
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
        }
      } else if (platform === 'spotify' && mediaUrl.includes('spotify.com')) {
        embedUrl = mediaUrl.replace('open.spotify.com', 'open.spotify.com/embed');
      } else if (platform === 'audiomack' && mediaUrl.includes('audiomack.com')) {
        embedUrl = mediaUrl.replace('audiomack.com', 'audiomack.com/embed');
      } else if (platform === 'apple_music' && mediaUrl.includes('music.apple.com')) {
        embedUrl = mediaUrl.replace('music.apple.com', 'embed.music.apple.com');
      }
    }

    // Create campaign
    const campaign = await Campaign.create({
      title,
      description,
      creatorName,
      creatorAvatar: creatorAvatar || 'https://i.postimg.cc/59XZ1skK/LOGO.jpg',
      platform,
      campaignType,
      mediaUrl,
      embedUrl,
      thumbnailUrl,
      thumbnailPublicId,
      reward,
      totalBudget,
      completionType,
      requiredDuration,
      requiredPercentage,
      allowSkipping,
      countPaused,
      repeatLimit,
      status,
      totalDuration,
      coverArt,
      coverArtPublicId,
    });

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

// GET - Fetch all campaigns (for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const campaigns = await Campaign.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}
