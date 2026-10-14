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
              <form className="px-6 md:px-7" onSubmit={handleSubmit}>
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
                      placeholder="taskkash@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-5 text-[15px] rounded-lg"
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
                        className="p-5 text-[15px] pr-12 rounded-lg"
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
                    className="w-full p-5 bg-emerald-500 rounded-lg hover:bg-emerald-600 font-semibold text-white text-[15px] font-medium cursor-pointer"
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

                  
                  <div className="grid grid-cols-3 gap-4">
                    {/* X */}
                    <Button
                      type="button"
                      className="w-full cursor-pointer bg-black text-white border-0"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.637 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932 6.064-6.932zM17.61 20.644h2.039L6.486 3.24H4.298z" />
                      </svg>
                      <span className="sr-only">Continue with X</span>
                    </Button>

                    {/* Google */}
                    <div className="relative">
                      <Button
                        type="button"
                        className="w-full cursor-pointer bg-white hover:bg-gray-100 border border-gray-300"
                      >
                        <svg
                          className="h-7 w-7"
                          viewBox="0 0 48 48"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="#FFC107"
                            d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.207 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                          />
                          <path
                            fill="#FF3D00"
                            d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.348 4.337-17.694 10.691z"
                          />
                          <path
                            fill="#4CAF50"
                            d="M24 44c5.104 0 9.799-1.957 13.355-5.145l-6.169-5.22C29.125 35.091 26.673 36 24 36c-5.186 0-9.623-3.326-11.283-7.946l-6.52 5.025C9.505 39.556 16.227 44 24 44z"
                          />
                          <path
                            fill="#1976D2"
                            d="M43.611 20.083H42V20H24v8h11.303c-1.058 2.996-3.202 5.379-6.117 6.635l6.169 5.22C38.999 36.564 44 31 44 24c0-1.341-.138-2.65-.389-3.917z"
                          />
                        </svg>

                        <span className="sr-only">Continue with Google</span>
                      </Button>
                    </div>

                    {/* Facebook */}
                    <Button
                      type="button"
                      className="w-full cursor-pointer bg-[#1877F2] hover:bg-[#166FE5] text-white border-0"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="sr-only">Continue with Facebook</span>
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