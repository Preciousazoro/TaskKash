import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { getProfileCache, setProfileCache, clearProfileCache } from '@/lib/profileCache';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check cache first
    const cached = getProfileCache(session.user.id);
    if (cached) {
      return NextResponse.json(cached);
    }

    await connectDB();
    
    const user = await User.findById(session.user.id)
      .select('name email role username avatarUrl avatarPublicId taskPoints dailyStreak socialLinks phone country telegramUsername cryptoPayoutAddresses')
      .lean()
      .maxTimeMS(3000) as any; // Add timeout
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userProfile = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username || '',
      avatarUrl: user.avatarUrl || null,
      avatarPublicId: user.avatarPublicId || null,
      taskPoints: user.taskPoints || 0,
      dailyStreak: user.dailyStreak || 0,
      socialLinks: user.socialLinks || {
        twitter: null,
        instagram: null,
        linkedin: null,
        facebook: null,
        whatsapp: null,
        tiktok: null,
        telegram: null,
        discord: null,
      },
      phone: user.phone || null,
      country: user.country || null,
      telegramUsername: user.telegramUsername || null,
      cryptoPayoutAddresses: user.cryptoPayoutAddresses || [],
    };

    // Cache the result
    setProfileCache(session.user.id, userProfile);

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, username, avatarUrl, avatarPublicId, socialLinks, phone, country, telegramUsername } = body;

    console.log('=== PROFILE UPDATE REQUEST ===');
    console.log('Received data:', { name, username, socialLinks, phone, telegramUsername });

    await connectDB();
    
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if username is already taken by another user (only if username is provided)
    if (username && username.trim() && username !== user.username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: user._id } 
      });
      
      if (existingUser) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (username !== undefined) {
      // Only validate username if it's provided (not empty)
      if (username && username.trim()) {
        // Backend validation for username
        if (username.length < 3) {
          return NextResponse.json({ error: 'Username should be at least 3 characters long' }, { status: 400 });
        }
        
        if (username.length > 20) {
          return NextResponse.json({ error: 'Username cannot be more than 20 characters' }, { status: 400 });
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          return NextResponse.json({ error: 'Username can only contain letters, numbers, and underscores' }, { status: 400 });
        }
        
        user.username = username;
      } else {
        // Allow empty username
        user.username = undefined;
      }
    }
    
    // Handle avatar update with Cloudinary cleanup
    if (avatarUrl !== undefined) {
      // Delete old avatar from Cloudinary if it exists and is different
      if (user.avatarPublicId && user.avatarPublicId !== avatarPublicId) {
        try {
          await deleteFromCloudinary(user.avatarPublicId);
        } catch (error) {
          console.error('Error deleting old avatar:', error);
          // Continue with update even if deletion fails
        }
      }
      
      user.avatarUrl = avatarUrl;
      user.avatarPublicId = avatarPublicId || null;
    }
    
    if (socialLinks) {
      console.log('Updating socialLinks:', socialLinks);
      // Trim all social media URLs to remove trailing spaces
      const trimmedSocialLinks: any = {};
      for (const [key, value] of Object.entries(socialLinks)) {
        trimmedSocialLinks[key] = value && typeof value === 'string' ? value.trim() : value;
      }
      console.log('Trimmed socialLinks:', trimmedSocialLinks);
      user.socialLinks = trimmedSocialLinks;
    }
    
    if (phone !== undefined) {
      console.log('Updating phone:', phone);
      user.phone = phone;
    }
    if (country !== undefined) user.country = country;
    if (telegramUsername !== undefined) {
      console.log('Updating telegramUsername:', telegramUsername);
      user.telegramUsername = telegramUsername;
    }

    console.log('Saving user to database...');
    try {
      await user.save();
      console.log('User saved successfully');
    } catch (saveError: any) {
      console.error('Error saving user:', saveError);
      if (saveError.name === 'ValidationError') {
        console.error('Validation errors:', saveError.errors);
        return NextResponse.json({ 
          error: 'Validation failed', 
          details: Object.values(saveError.errors).map((err: any) => err.message)
        }, { status: 400 });
      }
      throw saveError;
    }

    // Clear cache for this user
    clearProfileCache(session.user.id);

    const updatedProfile = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username || '',
      avatarUrl: user.avatarUrl || null,
      avatarPublicId: user.avatarPublicId || null,
      taskPoints: user.taskPoints || 0,
      dailyStreak: user.dailyStreak || 0,
      socialLinks: user.socialLinks || {
        twitter: null,
        instagram: null,
        linkedin: null,
        facebook: null,
        whatsapp: null,
        tiktok: null,
        telegram: null,
        discord: null,
      },
      phone: user.phone || null,
      country: user.country || null,
      telegramUsername: user.telegramUsername || null,
      cryptoPayoutAddresses: user.cryptoPayoutAddresses || [],
    };

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationError = error as any;
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: Object.values(validationError.errors).map((err: any) => err.message)
      }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
