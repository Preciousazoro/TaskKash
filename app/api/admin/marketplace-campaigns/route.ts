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
      (req: any) => req && req.description && req.description.trim() !== ''
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

// POST - Create new marketplace campaign
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] POST /api/admin/marketplace-campaigns - START`);
  
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.log(`[${requestId}] Not authenticated`);
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    console.log(`[${requestId}] Request body name:`, body.name);
    
    // Clean up complex fields to remove invalid/incomplete entries
    const cleanedData = cleanComplexFields(body);

    // Ensure required defaults are set
    const campaignData = {
      ...cleanedData,
      visibility: body.visibility || 'draft',
      category: cleanedData.category || 'General',
      type: cleanedData.type || 'social',
      name: cleanedData.name || '',
      brandName: cleanedData.brandName || '',
      description: cleanedData.description || '',
      shortDescription: cleanedData.shortDescription || '',
      rewardAmount: cleanedData.rewardAmount || 0
    };

    console.log(`[${requestId}] About to create campaign`);
    console.log(`[${requestId}] Campaign data:`, JSON.stringify(campaignData, null, 2));
    const campaign = new MarketplaceCampaign(campaignData);
    await campaign.save({ validateBeforeSave: false, validateModifiedOnly: false });
    console.log(`[${requestId}] Campaign created with ID:`, (campaign as any)._id);

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error(`[${requestId}] Error creating marketplace campaign:`, error);
    return NextResponse.json(
      { error: 'Failed to create marketplace campaign' },
      { status: 500 }
    );
  }
}

// GET - Fetch all marketplace campaigns (for admin)
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

    const { searchParams } = new URL(request.url);
    const visibility = searchParams.get('visibility');

    const filter: any = {};
    if (visibility) {
      filter.visibility = visibility;
    }

    const campaigns = await MarketplaceCampaign.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error('Error fetching marketplace campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace campaigns' },
      { status: 500 }
    );
  }
}
