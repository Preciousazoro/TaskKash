import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Simple in-memory cache for balance data (2 minutes TTL)
const balanceCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check cache first (only if no welcome bonus needs to be applied)
    const cached = balanceCache.get(session.user.id);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL && !cached.data.welcomeBonusApplied) {
      return NextResponse.json(cached.data);
    }

    await connectDB();

    // Find user with lean query for better performance
    const user = await User.findById(session.user.id)
      .select('taskPoints tasksCompleted welcomeBonusGranted')
      .lean()
      .maxTimeMS(3000) as any; // Add timeout
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only apply welcome bonus if not already granted and user has 0 points
    let welcomeBonusApplied = false;
    if (!user.welcomeBonusGranted && (!user.taskPoints || user.taskPoints === 0)) {
      try {
        const { createWelcomeBonus } = await import('@/lib/transactions');
        await createWelcomeBonus(session.user.id);
        welcomeBonusApplied = true;
        
        // Refresh user data after bonus
        const updatedUser = await User.findById(session.user.id)
          .select('taskPoints tasksCompleted')
          .lean()
          .maxTimeMS(3000) as any;
          
        const result = {
          taskPoints: updatedUser?.taskPoints || 50,
          tasksCompleted: updatedUser?.tasksCompleted || 0,
          welcomeBonusApplied
        };
        
        // Cache the result
        balanceCache.set(session.user.id, { data: result, timestamp: Date.now() });
        
        return NextResponse.json(result);
      } catch (error) {
        console.error('Error applying welcome bonus:', error);
      }
    }

    const result = {
      taskPoints: user.taskPoints || 0,
      tasksCompleted: user.tasksCompleted || 0,
      welcomeBonusApplied
    };

    // Cache the result
    balanceCache.set(session.user.id, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Get user points error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
