import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import User from '@/models/User';
import Gift from '@/models/Gift';
import mongoose from 'mongoose';
import { sendGiftDeductionEmail, sendGiftCreditEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { receiverId, amount } = body;

    if (!receiverId || !amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid request parameters' }, { status: 400 });
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    // Get sender and receiver
    const sender = await User.findById(session.user.id);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (sender._id.toString() === receiver._id.toString()) {
      return NextResponse.json({ success: false, error: 'Cannot send gift to yourself' }, { status: 400 });
    }

    // Check sender balance
    if (sender.taskPoints < amount) {
      return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
    }

    // Start transaction
    const session_db = await mongoose.startSession();
    session_db.startTransaction();

    try {
      // Deduct from sender
      sender.taskPoints -= amount;
      await sender.save({ session: session_db });

      // Add to receiver
      receiver.taskPoints += amount;
      await receiver.save({ session: session_db });

      // Create gift record
      await Gift.create([{
        senderId: sender._id,
        receiverId: receiver._id,
        senderName: sender.name,
        senderEmail: sender.email,
        receiverName: receiver.name,
        receiverEmail: receiver.email,
        amount: amount,
        commission: 0,
        status: 'completed'
      }], { session: session_db });

      await session_db.commitTransaction();
      session_db.endSession();

      // Send emails
      await sendGiftDeductionEmail(sender.email, sender.name, receiver.name, amount);
      await sendGiftCreditEmail(receiver.email, receiver.name, sender.name, amount);

      return NextResponse.json({ 
        success: true, 
        message: 'Gift sent successfully'
      });
    } catch (transactionError) {
      await session_db.abortTransaction();
      session_db.endSession();
      throw transactionError;
    }
  } catch (error) {
    console.error('Error sending gift:', error);
    return NextResponse.json({ success: false, error: 'Failed to send gift' }, { status: 500 });
  }
}
