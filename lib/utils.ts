import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  let timeGreeting = "Evening";
  
  if (hour < 12) {
    timeGreeting = "Morning";
  } else if (hour < 18) {
    timeGreeting = "Afternoon";
  }
  
  return `${timeGreeting}, ${name}!`;
}