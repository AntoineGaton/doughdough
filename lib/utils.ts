import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phoneNumber;
}

export function validatePhoneNumber(phone: string): boolean {
  // Remove all non-digits and check if it's exactly 10 digits
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
}

export function validateAddress(address: string): boolean {
  // More comprehensive address validation
  return address.length >= 5 && /\d/.test(address) && /[a-zA-Z]/.test(address);
}

export function validateZipCode(zipCode: string): boolean {
  return /^\d{5}$/.test(zipCode);
}

export function validateState(state: string): boolean {
  return /^[A-Z]{2}$/.test(state);
}
