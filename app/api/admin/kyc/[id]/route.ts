import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { sendTransactionalEmail } from '@/lib/emailService';

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, rejectionReason } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be approve or reject' },
        { status: 400 }
      );
    }

    await client.connect();
    const kycCollection = db.collection('kyc');

    // Find the KYC submission
    const kycSubmission = await kycCollection.findOne({
      _id: new ObjectId(id)
    });

    if (!kycSubmission) {
      await client.close();
      return NextResponse.json(
        { error: 'KYC submission not found' },
        { status: 404 }
      );
    }

    // Update the KYC submission
    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'rejected',
      updatedAt: new Date(),
      reviewedAt: new Date(),
    };

    if (action === 'reject' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    await kycCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Send rejection email if rejected
    if (action === 'reject' && rejectionReason && kycSubmission.userEmail) {
      try {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">KYC Verification Update</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Dear ${kycSubmission.firstName || 'User'},
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                We regret to inform you that your KYC verification submission has been <strong>rejected</strong>.
              </p>
              <div style="background: #fee; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0;">
                <p style="color: #333; font-size: 14px; margin: 0;">
                  <strong>Rejection Reason:</strong><br>
                  ${rejectionReason}
                </p>
              </div>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Please review the rejection reason above and resubmit your KYC verification with the correct information.
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                If you believe this is an error, please contact our support team.
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Submission ID: ${kycSubmission.submissionId}
              </p>
              <p style="color: #666; font-size: 14px;">
                Best regards,<br>
                TaskKash Team
              </p>
            </div>
          </div>
        `;

        await sendTransactionalEmail(
          kycSubmission.userEmail,
          'KYC Verification Rejected',
          emailHtml,
          `Your KYC verification has been rejected. Reason: ${rejectionReason}`
        );
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
        // Don't fail the request if email fails
      }
    }

    await client.close();

    return NextResponse.json({
      success: true,
      message: `KYC submission ${action}d successfully`,
    });
  } catch (error) {
    console.error('Error updating KYC submission:', error);
    await client.close();
    return NextResponse.json(
      { error: 'Failed to update KYC submission' },
      { status: 500 }
    );
  }
}
