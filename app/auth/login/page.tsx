"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import TaskKashFooter from "@/components/landing-page/TaskKashFooter";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/user-dashboard/dashboard'
      });

      if (result?.error) {
        if (result.error === 'EMAIL_NOT_VERIFIED') {
          toast.error('Please verify your email before logging in. Check your inbox for the verification code.');
        } else {
          toast.error('Invalid email or password');
        }
      } else if (result?.ok) {
        toast.success('Login successful!');
        setTimeout(() => {
          router.push('/user-dashboard/dashboard');
        }, 1000);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
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
              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground text-sm">
                      Login to access your account and earn rewards
                    </p>
                  </div>

                  {/* Email Input Field */}
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="secure@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-5 text-[15px]"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* Password Input Field */}
                  <div className="grid gap-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          href="/auth/forgot-password"
                          className="ml-2 text-sm underline-offset-2 hover:underline text-muted-foreground hover:text-foreground transition"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>

                    <div className="relative">
                      <Input 
                        id="password" 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-5 text-[15px] pr-12"
                        disabled={isLoading}
                        required
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
                        Signing in...
                      </>
                    ) : (
                      'Sign In Account'
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>

                  {/* Social / Web3 Wallet Options */}
                  <div className="grid grid-cols-1 gap-4">
                    <Button variant="outline" className="w-full cursor-pointer h-11" type="button">
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      <span>Connect Wallet</span>
                    </Button>
                  </div>

                  {/* Sign Up Navigation */}
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="underline underline-offset-4 font-medium">
                      Sign up
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