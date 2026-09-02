"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from 'react-toastify';
import TaskKashFooter from "@/components/landing-page/TaskKashFooter";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Password reset instructions sent to your email');
      } else {
        toast.error(data.error || 'Failed to send reset instructions');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      <main className="flex-grow flex items-center justify-center px-3 py-10 p-6 md:p-10 transition-colors duration-300 mb-15">
        <div className="w-full max-w-sm md:max-w-[450px] overflow-hidden">
          <Card className="overflow-hidden bg-card border border-border rounded-3xl shadow-lg">
            <CardContent className="p-0">
              
              {isSubmitted ? (
                /* SUCCESS STATE VIEW */
                <div className="p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-14 h-14 bg-green-500/10 rounded-full mb-4">
                      <CheckCircle2 className="w-7 h-7 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold">Check Your Email</h1>
                    <p className="text-balance text-muted-foreground text-sm mt-1">
                      We've sent password reset instructions to{" "}
                      <span className="font-semibold text-foreground break-all">{email}</span>
                    </p>
                    <p className="text-balance text-muted-foreground text-xs mt-4">
                      Didn't receive the email? Check your spam folder or try again with a different email address.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="w-full h-11 cursor-pointer"
                    >
                      Try Different Email
                    </Button>
                    
                    <div className="text-center text-sm mt-2">
                      <Link href="/auth/login" className="inline-flex items-center underline underline-offset-4 text-muted-foreground hover:text-foreground font-medium transition">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* ACTIVE INPUT FORM VIEW */
                <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-6">
                    
                    {/* Header / Logo Section */}
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Forgot Password?</h1>
                      <p className="text-balance text-muted-foreground text-sm">
                        Enter your account email to receive a secure configuration link
                      </p>
                    </div>

                    {/* Email Input Field */}
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-5 text-[15px]"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                    className="w-full p-5 bg-emerald-500 hover:bg-emerald-600 font-semibold text-white text-[15px] font-medium cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Instructions...
                        </>
                      ) : (
                        'Send Reset Instructions'
                      )}
                    </Button>

                    {/* Back to Login Link */}
                    <div className="text-center text-sm">
                      <Link href="/auth/login" className="inline-flex items-center underline underline-offset-4 text-muted-foreground hover:text-foreground font-medium transition">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                      </Link>
                    </div>
                  </div>
                </form>
              )}
              
            </CardContent>
          </Card>

          {/* Sign Up Footer Query */}
          {!isSubmitted && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="underline underline-offset-4 font-medium text-foreground">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <TaskKashFooter />
    </div>
  );
}