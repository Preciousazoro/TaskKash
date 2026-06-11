"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Shield } from "lucide-react";
import { toast } from 'react-toastify';
import TaskKashFooter from "@/components/landing-page/TaskKashFooter";
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isExpired, setIsExpired] = useState(false);
  
  const router = useRouter();

  // Get email from sessionStorage on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('signupEmail');
    if (!storedEmail) {
      toast.error('Email not found. Please start the signup process again.');
      router.push('/auth/signup');
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isExpired) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isExpired) {
      setIsExpired(true);
    }
  }, [timeLeft, isExpired]);

  const handleOtpChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (numericValue && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        prevInput.focus();
      }
    }
    
    if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
        const newOtp = numericText.split('').concat(Array(6 - numericText.length).fill(''));
        setOtp(newOtp);
        
        const lastFilledIndex = numericText.length - 1;
        if (lastFilledIndex >= 0 && lastFilledIndex < 6) {
          const lastInput = document.getElementById(`otp-${lastFilledIndex}`) as HTMLInputElement;
          if (lastInput) lastInput.focus();
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    if (isExpired) {
      toast.error('Verification code has expired. Please request a new one.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otpCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email verified successfully! Account created.');
        sessionStorage.removeItem('signupEmail');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        toast.error(data.error || 'Verification failed');
        setOtp(["", "", "", "", "", ""]);
        const firstInput = document.getElementById('otp-0') as HTMLInputElement;
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    
    setIsResending(true);
    
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('New verification code sent to your email!');
        setTimeLeft(120);
        setIsExpired(false);
        setOtp(["", "", "", "", "", ""]);
        const firstInput = document.getElementById('otp-0') as HTMLInputElement;
        if (firstInput) firstInput.focus();
      } else {
        toast.error(data.error || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskedEmail = email.replace(/(.{2}).*(@.*)/, '$1***$2');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      <main className="flex-grow flex items-center justify-center px-3 py-10 p-6 md:p-10 transition-colors duration-300 mb-15">
        <div className="w-full max-w-sm md:max-w-[450px] overflow-hidden">
          <Card className="overflow-hidden bg-card border border-border rounded-3xl shadow-lg">
            <CardContent className="p-0">
              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  
                  {/* Header */}
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Verify Your Email</h1>
                    <p className="text-balance text-muted-foreground text-sm">
                      We sent a 6-digit code to {maskedEmail || "your email"}
                    </p>
                  </div>

                  {/* OTP Digits Input Fields Container */}
                  <div className="flex justify-center gap-2 my-2">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold bg-background border border-input text-foreground focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all"
                        disabled={isLoading}
                        required
                      />
                    ))}
                  </div>

                  {/* Countdown Timer and Resend triggers */}
                  <div className="text-center text-sm">
                    {isExpired ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-destructive text-sm">Code has expired</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleResend}
                          disabled={isResending}
                          className="w-full cursor-pointer"
                        >
                          {isResending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending Code...
                            </>
                          ) : (
                            'Resend Code'
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        Code expires in <span className="font-mono font-semibold text-foreground">{formatTime(timeLeft)}</span>
                        <div className="mt-1">
                          <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending || timeLeft > 60}
                            className="underline underline-offset-4 font-medium text-foreground disabled:opacity-50 disabled:no-underline disabled:text-muted-foreground cursor-pointer"
                          >
                            {isResending ? 'Sending...' : 'Resend Code'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Verification Button */}
                  <Button 
                    type="submit" 
                    className="w-full p-5 bg-emerald-500 hover:bg-emerald-600 font-semibold text-white text-[15px] font-medium cursor-pointer"
                    disabled={isLoading || isExpired}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Verify Email
                      </>
                    )}
                  </Button>

                  {/* Back to Sign Up Navigation */}
                  <div className="text-center text-sm border-t border-border pt-4">
                    <Link href="/auth/signup" className="underline underline-offset-4 font-medium text-muted-foreground hover:text-foreground transition">
                      Back to Sign Up
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