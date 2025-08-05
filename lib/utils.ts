import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export const currencyOption = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  ZEC: 'ZEC',
  INR: 'Rs.',
};


export type TCurrencyKey = keyof typeof currencyOption
 