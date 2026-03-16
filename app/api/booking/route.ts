import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { AdminNotifications } from "@/lib/adminNotifications";
import { sendMarketingEmail } from "@/lib/email";

// GET /api/booking - Fetch all bookings (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Build query
    const query: any = {};
    
    // Filter by status if specified
    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    // Get total count for pagination
    const total = await Booking.countDocuments(query);

    // Fetch bookings with pagination
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/booking - Create new booking (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, email, phone, message } = body;

    // Validate required fields
    if (!companyName || !email) {
      return NextResponse.json(
        { error: "Company name and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Create booking record
    const booking = await Booking.create({
      companyName,
      email,
      phone: phone || "",
      message: message || "",
      status: "pending",
      metadata: {
        userAgent: request.headers.get("user-agent"),
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      },
    });

    // Create admin notification for new booking
    try {
      await AdminNotifications.bookingCreated(booking._id.toString(), companyName);
    } catch (error) {
      console.error('Failed to create booking notification:', error);
      // Don't fail the request if notification fails
    }

    // Send email to marketing team
    try {
      const emailSent = await sendMarketingEmail(companyName, email, phone, message);
      if (!emailSent) {
        console.error('Failed to send marketing email notification');
        // Don't fail the request but log the error
      } else {
        console.log('Marketing email sent successfully for:', companyName);
      }
    } catch (error) {
      console.error('Error sending marketing email:', error);
      // Don't fail the request but log the error
    }

    return NextResponse.json({
      success: true,
      bookingId: booking._id,
      message: "Booking request submitted successfully",
    });

  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit booking request" },
      { status: 500 }
    );
  }
}
