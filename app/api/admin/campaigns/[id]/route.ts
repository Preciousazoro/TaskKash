import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import { v2 as cloudinary } from 'cloudinary';

// PUT - Update a campaign
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await request.formData();

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
    const thumbnailUrl = formData.get('thumbnailUrl') as string;
    const creatorAvatar = formData.get('creatorAvatar') as string;
    const avatarFile = formData.get('avatarFile') as File | null;

    // Upload avatar file if provided
    let finalCreatorAvatar = creatorAvatar;
    if (avatarFile) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const arrayBuffer = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await cloudinary.uploader.upload(
        `data:${avatarFile.type};base64,${buffer.toString('base64')}`,
        {
          folder: 'campaign-avatars',
          resource_type: 'image',
        }
      );

      finalCreatorAvatar = (result as any).secure_url;
    }

    // Generate embed URL based on platform and media URL
    let embedUrl: string | undefined;
    let finalThumbnailUrl = thumbnailUrl;
    if (mediaUrl) {
      if (platform === 'youtube' && (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be'))) {
        const videoId = mediaUrl.includes('youtu.be')
          ? mediaUrl.split('/').pop()?.split('?')[0]
          : new URL(mediaUrl).searchParams.get('v');
        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
          // Auto-extract YouTube thumbnail if no thumbnail uploaded
          if (!thumbnailUrl) {
            finalThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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

    // Update campaign
    const campaign = await Campaign.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        creatorName,
        creatorAvatar: finalCreatorAvatar || 'https://i.postimg.cc/59XZ1skK/LOGO.jpg',
        platform,
        campaignType,
        mediaUrl,
        embedUrl,
        thumbnailUrl: finalThumbnailUrl,
        reward,
        totalBudget,
        completionType,
        requiredDuration,
        requiredPercentage,
        allowSkipping,
        countPaused,
        repeatLimit,
        status,
      },
      { new: true }
    );

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// GET - Fetch a single campaign
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const campaign = await Campaign.findById(params.id);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const campaign = await Campaign.findByIdAndDelete(params.id);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
