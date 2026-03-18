import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Broadcast from '@/models/Broadcast';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { sendBroadcastEmail } from '@/lib/email';
import mongoose from 'mongoose';

// GET /api/admin/broadcasts - Fetch broadcasts and stats
export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    await mongoose.connect(process.env.MONGODB_URI!);

    if (action === 'stats') {
      // Get broadcast statistics
      const totalBroadcasts = await Broadcast.countDocuments();
      const emailBroadcasts = await Broadcast.countDocuments({ sentViaEmail: true });
      const inAppBroadcasts = await Broadcast.countDocuments({ sentViaInApp: true });
      
      // Recent broadcasts (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentBroadcasts = await Broadcast.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });

      return NextResponse.json({
        success: true,
        data: {
          totalBroadcasts,
          emailBroadcasts,
          inAppBroadcasts,
          recentBroadcasts
        }
      });
    }

    // Get paginated broadcasts
    const skip = (page - 1) * limit;
    const broadcasts = await Broadcast.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Broadcast.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        broadcasts,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: total
        }
      }
    });

  } catch (error) {
    console.error('Broadcast GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch broadcast data' },
      { status: 500 }
    );
  }
}

// POST /api/admin/broadcasts - Create and send new broadcast
export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const { title, message, sendViaEmail, sendViaInApp } = body;

    // Debug logs for broadcast request
    console.log("=== BROADCAST REQUEST DEBUG ===");
    console.log("Title:", title);
    console.log("Message:", message);
    console.log("sendViaEmail:", sendViaEmail);
    console.log("sendViaInApp:", sendViaInApp);
    console.log("================================");

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    if (!sendViaEmail && !sendViaInApp) {
      return NextResponse.json({ error: 'At least one delivery method must be selected' }, { status: 400 });
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    // Get ALL users for broadcast (no filtering)
    const users = await User.find({});

    if (users.length === 0) {
      return NextResponse.json({ error: 'No users found in database' }, { status: 400 });
    }

    // Create broadcast record
    const broadcast = new Broadcast({
      title: title.trim(),
      message: message.trim(),
      sentViaEmail: sendViaEmail,
      sentViaInApp: sendViaInApp,
      createdBy: session.user.id
    });

    await broadcast.save();

    let emailsSent = 0;
    let notificationsCreated = 0;
    const errors: string[] = [];

    // Send emails if requested
    if (sendViaEmail) {
      try {
        const emailResults = await sendBroadcastEmail(
          users.filter(user => user.email),
          title.trim(),
          message.trim()
        );
        emailsSent = emailResults.sent;
        
        if (emailResults.errors.length > 0) {
          errors.push(...emailResults.errors);
        }
      } catch (emailError) {
        console.error('Email broadcast error:', emailError);
        errors.push('Failed to send some emails');
      }
    }

    // Create in-app notifications if requested
    if (sendViaInApp) {
      try {
        console.log("sendInApp:", sendViaInApp); // Debug log
        console.log("Creating notifications for users:", users.length);
        
        const notifications = users.map(user => ({
          userId: user._id,
          type: 'broadcast' as const,
          title: title.trim(),
          message: message.trim(),
          isRead: false // Add missing isRead field
        }));

        const notificationResults = await Notification.insertMany(notifications);
        notificationsCreated = notificationResults.length;
        
        console.log(`Successfully created ${notificationsCreated} notifications`);
      } catch (notificationError) {
        console.error('Notification creation error:', notificationError);
        errors.push('Failed to create some notifications');
      }
    }

    // Populate creator info for response
    await broadcast.populate('createdBy', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Broadcast sent successfully',
      data: {
        broadcast,
        emailsSent,
        notificationsCreated,
        totalRecipients: users.length,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error('Broadcast POST error:', error);
    return NextResponse.json(
      { error: 'Failed to send broadcast' },
      { status: 500 }
    );
  }
}
