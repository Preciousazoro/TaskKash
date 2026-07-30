'use client';

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Field wrapper component
export function Field({ label, required, hint, className, children }: { 
  label?: string; 
  required?: boolean; 
  hint?: string; 
  className?: string; 
  children: React.ReactNode 
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label className={cn("text-xs font-semibold text-foreground", required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
          {label}
        </Label>
      )}
      {children}
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

// TextInput wrapper
export function TextInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return <Input className={cn("bg-muted/30", className)} {...props} />;
}

// TextArea wrapper
export function TextArea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 outline-none resize-none",
        className
      )}
      {...props}
    />
  );
}

// Select wrapper
export function Select({ 
  value, 
  onChange, 
  options, 
  className 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  options: { value: string; label: string }[]; 
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Toggle wrapper
export function Toggle({ 
  checked, 
  onChange, 
  label, 
  hint 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  label?: string; 
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Checkbox
          id={label}
          checked={checked}
          onCheckedChange={(checked) => onChange(checked as boolean)}
        />
        {label && (
          <Label htmlFor={label} className="text-xs font-semibold text-foreground cursor-pointer">
            {label}
          </Label>
        )}
      </div>
      {hint && <p className="text-[10px] text-muted-foreground ml-6">{hint}</p>}
    </div>
  );
}