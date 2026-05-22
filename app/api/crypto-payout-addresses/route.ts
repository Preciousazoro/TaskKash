import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User, { CryptoAddress } from '@/models/User';
import { clearProfileCache } from '../profile/route';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findById(session.user.id)
      .select('cryptoPayoutAddresses')
      .lean() as { cryptoPayoutAddresses?: CryptoAddress[] } | null;
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ payoutAddresses: user.cryptoPayoutAddresses || [] });
  } catch (error) {
    console.error('Error fetching crypto payout addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch crypto payout addresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      console.error('POST: Unauthorized - no session or user id');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { crypto, address } = body;

    console.log('POST: Received data:', { crypto, address });

    if (!crypto || !address) {
      console.error('POST: Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!crypto.name || !crypto.symbol || !crypto.icon) {
      console.error('POST: Invalid crypto data');
      return NextResponse.json({ error: 'Invalid crypto data' }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findById(session.user.id);
    
    if (!user) {
      console.error('POST: User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('POST: User found, current cryptoPayoutAddresses:', user.cryptoPayoutAddresses);

    // Check if user already has an address for this crypto
    const existingAddress = user.cryptoPayoutAddresses?.find(
      (addr: any) => addr.crypto.symbol === crypto.symbol
    );

    if (existingAddress) {
      console.error('POST: Address already exists for this crypto');
      return NextResponse.json({ error: 'You already have an address for this cryptocurrency' }, { status: 400 });
    }

    // Create new address
    const newAddress: CryptoAddress = {
      id: Date.now().toString(),
      crypto,
      address,
    };

    if (!user.cryptoPayoutAddresses) {
      user.cryptoPayoutAddresses = [];
    }

    user.cryptoPayoutAddresses.push(newAddress);
    console.log('POST: About to save user with new address:', user.cryptoPayoutAddresses);

    const savedUser = await user.save();
    console.log('POST: User saved successfully, cryptoPayoutAddresses:', savedUser.cryptoPayoutAddresses);

    // Clear profile cache to ensure fresh data on next fetch
    clearProfileCache(session.user.id);

    return NextResponse.json({ payoutAddresses: savedUser.cryptoPayoutAddresses });
  } catch (error) {
    console.error('POST: Error adding crypto payout address:', error);
    return NextResponse.json({ error: 'Failed to add crypto payout address' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, crypto, address } = body;

    if (!id || !crypto || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.cryptoPayoutAddresses) {
      user.cryptoPayoutAddresses = [];
    }

    // Find and update the address
    const addressIndex = user.cryptoPayoutAddresses.findIndex(
      (addr: CryptoAddress) => addr.id === id
    );

    if (addressIndex === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Check if the new crypto symbol conflicts with another address
    const conflictingAddress = user.cryptoPayoutAddresses.find(
      (addr: CryptoAddress) => addr.crypto.symbol === crypto.symbol && addr.id !== id
    );

    if (conflictingAddress) {
      return NextResponse.json({ error: 'You already have an address for this cryptocurrency' }, { status: 400 });
    }

    user.cryptoPayoutAddresses[addressIndex] = {
      id,
      crypto,
      address,
    };

    await user.save();

    // Clear profile cache to ensure fresh data on next fetch
    clearProfileCache(session.user.id);

    return NextResponse.json({ payoutAddresses: user.cryptoPayoutAddresses });
  } catch (error) {
    console.error('Error updating crypto payout address:', error);
    return NextResponse.json({ error: 'Failed to update crypto payout address' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      console.error('DELETE: Unauthorized - no session or user id');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log('DELETE: Request to delete address with id:', id);

    if (!id) {
      console.error('DELETE: Missing address id');
      return NextResponse.json({ error: 'Missing address id' }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findById(session.user.id);
    
    if (!user) {
      console.error('DELETE: User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('DELETE: User found, current cryptoPayoutAddresses:', user.cryptoPayoutAddresses);

    if (!user.cryptoPayoutAddresses) {
      user.cryptoPayoutAddresses = [];
    }

    const initialLength = user.cryptoPayoutAddresses.length;
    user.cryptoPayoutAddresses = user.cryptoPayoutAddresses.filter(
      (addr: any) => addr.id !== id
    );

    if (user.cryptoPayoutAddresses.length === initialLength) {
      console.error('DELETE: Address not found with id:', id);
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    console.log('DELETE: About to save user after deletion:', user.cryptoPayoutAddresses);
    const savedUser = await user.save();
    console.log('DELETE: User saved successfully, cryptoPayoutAddresses:', savedUser.cryptoPayoutAddresses);

    // Clear profile cache to ensure fresh data on next fetch
    clearProfileCache(session.user.id);

    return NextResponse.json({ payoutAddresses: savedUser.cryptoPayoutAddresses });
  } catch (error) {
    console.error('DELETE: Error deleting crypto payout address:', error);
    return NextResponse.json({ error: 'Failed to delete crypto payout address' }, { status: 500 });
  }
}
