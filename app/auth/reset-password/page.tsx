"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from 'react-toastify';
import TaskKashFooter from "@/components/landing-page/TaskKashFooter";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      toast.error('Invalid reset link. Please request a new password reset.');
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/validate-reset-token?token=${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          toast.error(data.error || 'Invalid or expired reset link');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setIsTokenValid(false);
        toast.error('Failed to validate reset link');
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        toast.error(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. LOADING STATE
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-grow flex items-center justify-center px-3 py-10 p-6 md:p-10 transition-colors duration-300 mb-15">
          <div className="w-full max-w-sm md:max-w-[450px] overflow-hidden">
            <Card className="overflow-hidden bg-card border border-border rounded-3xl shadow-lg">
              <CardContent className="p-6 md:p-8 flex flex-col items-center text-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Validating reset link...</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <TaskKashFooter />
      </div>
    );
  }

  // 2. INVALID TOKEN STATE
  if (isTokenValid === false) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-grow flex items-center justify-center px-3 py-10 p-6 md:p-10 transition-colors duration-300 mb-15">
          <div className="w-full max-w-sm md:max-w-[450px] overflow-hidden">
            <Card className="overflow-hidden bg-card border border-border rounded-3xl shadow-lg">
              <CardContent className="p-6 md:p-8 flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-14 h-14 bg-red-500/10 rounded-full mb-4">
                    <AlertCircle className="w-7 h-7 text-red-500" />
                  </div>
                  <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
                  <p className="text-balance text-muted-foreground text-sm mt-1">
                    This password reset link is invalid or has expired. Please request a new one.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/auth/forgot-password" passHref legacyBehavior>
                    <Button asChild className="w-full p-5 bg-emerald-500 hover:bg-emerald-600 font-semibold text-white text-[15px] font-medium cursor-pointer">
                      <a>Request New Reset Link</a>
                    </Button>
                  </Link>
                  
                  <Link href="/auth/login" passHref legacyBehavior>
                    <Button asChild variant="outline" className="w-full h-11 cursor-pointer">
                      <a>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                      </a>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <TaskKashFooter />
      </div>
    );
  }

  // 3. SUCCESS STATE
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-grow flex items-center justify-center px-3 py-10 p-6 md:p-10 transition-colors duration-300 mb-15">
          <div className="w-full max-w-sm md:max-w-[450px] overflow-hidden">
            <Card className="overflow-hidden bg-card border border-border rounded-3xl shadow-lg">
              <CardContent className="p-6 md:p-8 flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-14 h-14 bg-green-500/10 rounded-full mb-4">
                    <CheckCircle2 className="w-7 h-7 text-green-500" />
                  </div>
                  <h1 className="text-2xl font-bold">Success!</h1>
                  <p className="text-balance text-muted-foreground text-sm mt-1">
                    Your password has been successfully reset. You can now log in with your new credentials.
                  </p>
                </div>

                <Link href="/auth/login" passHref legacyBehavior>
                  <Button asChild className="w-full p-5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[15px] font-medium cursor-pointer">
                    <a>Continue to Login</a>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <TaskKashFooter />
      </div>
    );
  }

  // 4. RESET PASSWORD FORM ENTRY STATE
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      <main className="flex-grow flex items-center justify-center px-3 py-10 p-6 md:p-10 transition-colors duration-300 mb-15">
        <div className="w-full max-w-sm md:max-w-[450px] overflow-hidden">
          <Card className="overflow-hidden bg-card border border-border rounded-3xl shadow-lg">
            <CardContent className="p-0">
              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  
                  {/* Header / Logo Section */}
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-balance text-muted-foreground text-sm">
                      Enter your new account password below
                    </p>
                  </div>

                  {/* New Password Input Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-5 text-[15px] pr-12"
                        disabled={isLoading}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 cursor-pointer right-3 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {password && (
                      <p className={`text-xs ${validatePassword(password) ? 'text-green-500' : 'text-red-500'}`}>
                        {validatePassword(password) ? '✓ Password is valid' : 'Password must be at least 6 characters'}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Input Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="p-5 text-[15px] pr-12"
                        disabled={isLoading}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 cursor-pointer right-3 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {confirmPassword && (
                      <p className={`text-xs ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                        {password === confirmPassword ? '✓ Passwords match' : 'Passwords do not match'}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isLoading || !validatePassword(password) || password !== confirmPassword}
                    className="w-full p-5 bg-emerald-500 hover:bg-emerald-600 font-semibold text-white text-[15px] font-medium cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>

                  {/* Back to Login Link */}
                  <div className="text-center text-sm mt-2">
                    <Link href="/auth/login" className="inline-flex items-center underline underline-offset-4 text-muted-foreground hover:text-foreground font-medium transition">
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Bottom Legal Copy */}
          <div className="mt-6 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our{" "}
            <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.
          </div>
        </div>
      </main>
      
      <TaskKashFooter />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-grow flex items-center justify-center px-3 py-10 p-6 md:p-10 mb-15">
          <div className="w-full max-w-sm md:max-w-[450px]">
            <Card className="bg-card border border-border rounded-3xl shadow-lg">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <TaskKashFooter />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}