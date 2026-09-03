import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import MarketplaceCampaign from '@/models/MarketplaceCampaign';

// Helper function to clean up complex fields
function cleanComplexFields(data: any) {
  const cleaned = { ...data };
  
  // Clean requirements - only keep valid ones
  if (cleaned.requirements && Array.isArray(cleaned.requirements)) {
    cleaned.requirements = cleaned.requirements.filter(
      (req: any) => req && req.title && req.title.trim() !== ''
    );
  }
  
  // Clean steps - only keep valid ones
  if (cleaned.steps && Array.isArray(cleaned.steps)) {
    cleaned.steps = cleaned.steps.filter(
      (step: any) => step && step.title && step.title.trim() !== '' && step.description && step.description.trim() !== ''
    );
  }
  
  // Clean verificationFields - only keep valid ones
  if (cleaned.verificationFields && Array.isArray(cleaned.verificationFields)) {
    // Temporarily less strict - just require a type, not a label
    cleaned.verificationFields = cleaned.verificationFields.filter(
      (field: any) => field && field.type
    );
  }
  
  // Clean FAQs - only keep valid ones
  if (cleaned.faqs && Array.isArray(cleaned.faqs)) {
    cleaned.faqs = cleaned.faqs.filter(
      (faq: any) => faq && faq.question && faq.question.trim() !== '' && faq.answer && faq.answer.trim() !== ''
    );
  }
  
  return cleaned;
}

// GET - Fetch a single marketplace campaign
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

    const campaign = await MarketplaceCampaign.findById(params.id);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Marketplace campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error('Error fetching marketplace campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace campaign', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Update a marketplace campaign
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

    const body = await request.json();
    
    console.log('Update request - verificationFields:', body.verificationFields);
    console.log('Update request - verificationMode:', body.verificationMode);
    
    // Clean up complex fields to remove invalid/incomplete entries
    const cleanedData = cleanComplexFields(body);
    
    console.log('After cleaning - verificationFields:', cleanedData.verificationFields);

    const campaign = await MarketplaceCampaign.findByIdAndUpdate(
      params.id,
      cleanedData,
      { new: true, runValidators: false, validateBeforeSave: false }
    );

    if (!campaign) {
      return NextResponse.json(
        { error: 'Marketplace campaign not found' },
        { status: 404 }
      );
    }

    console.log('Updated campaign verificationFields:', campaign.verificationFields);

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error('Error updating marketplace campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update marketplace campaign', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a marketplace campaign
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

    const campaign = await MarketplaceCampaign.findByIdAndDelete(params.id);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Marketplace campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Marketplace campaign deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting marketplace campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete marketplace campaign' },
      { status: 500 }
    );
  }
}
