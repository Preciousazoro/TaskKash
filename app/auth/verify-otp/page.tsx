"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Mail, Shield } from "lucide-react";
import { toast } from 'react-toastify';
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
    // Only allow numbers
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
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        prevInput.focus();
      }
    }
    
    // Handle paste
    if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
        const newOtp = numericText.split('').concat(Array(6 - numericText.length).fill(''));
        setOtp(newOtp);
        
        // Focus last filled input
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
        // Clear sessionStorage
        sessionStorage.removeItem('signupEmail');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        toast.error(data.error || 'Verification failed');
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
        // Focus first input
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
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('New verification code sent to your email!');
        // Reset timer and OTP
        setTimeLeft(120);
        setIsExpired(false);
        setOtp(["", "", "", "", "", ""]);
        // Focus first input
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
    <div className="min-h-screen flex items-center justify-center text-foreground px-4 relative overflow-hidden bg-background transition-colors duration-300">
      <div className="absolute inset-0 bg-linear-to-tr from-[#00ff9d1a] via-transparent to-[#8a2be21a] blur-3xl opacity-50"></div>
      <div className="relative z-10 w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity cursor-pointer">
              <img
                src="/taskkash-logo.png"
                alt="TaskKash Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="text-xl font-bold bg-linear-to-r from-[#00ff9d] to-[#8a2be2] bg-clip-text text-transparent">
                Taskkash
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-semibold mb-1">Verify Your Email</h1>
          <p className="text-gray-400 text-sm">
            We sent a 6-digit code to {maskedEmail}
          </p>
        </div>

        {/* OTP Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-[0_0_20px_rgba(0,255,157,0.05)] transition-colors duration-300"
        >
          {/* OTP Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5 text-[#00ff9d]" />
              <span className="text-sm text-muted-foreground">Enter verification code</span>
            </div>
            
            <div className="flex justify-center gap-2">
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
                  className="w-12 h-14 text-center text-xl font-bold bg-background border border-input text-foreground focus-visible:ring-2 focus-visible:ring-[#00ff9d] transition-all"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            {isExpired ? (
              <div className="space-y-2">
                <p className="text-red-400 text-sm">Code has expired</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend Code'
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Code expires in <span className="font-mono text-[#00ff9d]">{formatTime(timeLeft)}</span>
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResend}
                  disabled={isResending || timeLeft > 60}
                  className="text-sm text-muted-foreground hover:text-[#00ff9d] transition-colors"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend Code'
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-linear-to-r from-[#00ff9d] to-[#8a2be2] text-white font-medium hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,255,157,0.3)]"
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
        </form>

        {/* Back to Signup */}
        <div className="text-center">
          <Link
            href="/auth/signup"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-[#00ff9d] transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
