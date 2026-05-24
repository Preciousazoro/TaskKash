"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { toast } from "react-toastify";
import TaskKashFooter from "@/components/landing-page/TaskKashFooter";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  
  const router = useRouter();

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!form.terms) {
      toast.error("You must accept the terms and conditions");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Verification code sent to your email!');
        sessionStorage.setItem('signupEmail', form.email);
        setTimeout(() => {
          router.push('/auth/verify-otp');
        }, 1500);
      } else {
        toast.error(data.error || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
                    <h1 className="text-2xl font-bold">Create Your Account</h1>
                    <p className="text-balance text-muted-foreground text-sm">
                      Start earning rewards by completing simple tasks
                    </p>
                  </div>

                  {/* Full Name Input Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="p-5 text-[15px]"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* Email Address Input Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="p-5 text-[15px]"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* Password Input Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
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

                  {/* Confirm Password Input Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        className="p-5 text-[15px] pr-12"
                        disabled={isLoading}
                        required
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
                  </div>

                  {/* Terms and Conditions Checkbox */}
                  <div className="flex items-start space-x-3 my-1">
                    <Checkbox
                      id="terms"
                      checked={form.terms}
                      onCheckedChange={(val) => handleChange("terms", Boolean(val))}
                      className="border-input data-[state=checked]:bg-[#00ff9d] data-[state=checked]:border-[#00ff9d]"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground leading-snug cursor-pointer select-none"
                    >
                      I agree to the{" "}
                      <Link href="#" className="underline underline-offset-4 hover:text-foreground transition">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="underline underline-offset-4 hover:text-foreground transition">
                        Privacy Policy
                      </Link>
                    </label>
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
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">
                      Or sign up with
                    </span>
                  </div>

                  {/* Social / Web3 Wallet Options */}
                  <div className="grid grid-cols-1 gap-4">
                    <Button variant="outline" className="w-full cursor-pointer h-11" type="button">
                      <Lock className="h-4 w-4 mr-2" />
                      <span>Connect Wallet</span>
                    </Button>
                  </div>

                  {/* Sign In Navigation */}
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="underline underline-offset-4 font-medium">
                      Sign in
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