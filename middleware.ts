import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from 'mongoose';
import WithdrawalVisibility from '@/models/WithdrawalVisibility';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * 🚨 ABSOLUTE BYPASS
   * Never intercept API routes, NextAuth, or static assets
   */
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  /**
   * 🔒 Protect dashboard pages
   */
  if (
    pathname.startsWith("/user-dashboard") ||
    pathname.startsWith("/admin-dashboard")
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }

    // 🔐 Additional admin role check for admin dashboard
    if (pathname.startsWith("/admin-dashboard") && token.role !== "admin") {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }

    // 🔒 Check withdrawal visibility for user withdrawal page
    if (pathname.startsWith("/user-dashboard/withdraw") && !pathname.includes("[id]")) {
      try {
        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.MONGODB_URI || '');
        }

        const visibility = await WithdrawalVisibility.findOne();
        
        // If withdrawals are not visible, redirect to locked page
        if (visibility && !visibility.isVisible) {
          return NextResponse.redirect(
            new URL("/user-dashboard/withdraw/locked", request.url)
          );
        }
      } catch (error) {
        console.error('Error checking withdrawal visibility in middleware:', error);
        // If there's an error, allow access (fail open)
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user-dashboard/:path*",
    "/admin-dashboard/:path*",
  ],
};
