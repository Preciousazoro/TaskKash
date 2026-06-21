import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Gift from "@/models/Gift";
import User from "@/models/User";
import mongoose from "mongoose";

interface Receiver {
  _id: mongoose.Types.ObjectId;
  avatarUrl?: string | null;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    // Fetch gift history for current user
    const gifts = await Gift.find({
      senderId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const receiverIds = gifts.map((gift: any) => gift.receiverId);

    const receivers = await User.find({
      _id: { $in: receiverIds },
    })
      .select("_id avatarUrl")
      .lean<Receiver[]>();

    const avatarMap = new Map(
      receivers.map((receiver) => [
        receiver._id.toString(),
        receiver.avatarUrl ?? null,
      ])
    );

    const giftsWithAvatars = gifts.map((gift: any) => ({
      ...gift,
      receiverAvatarUrl:
        avatarMap.get(gift.receiverId.toString()) ?? null,
    }));

    return NextResponse.json({
      success: true,
      gifts: giftsWithAvatars,
    });
  } catch (error) {
    console.error("Error fetching gift history:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gift history",
      },
      { status: 500 }
    );
  }
}