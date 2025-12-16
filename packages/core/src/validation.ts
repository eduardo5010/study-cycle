import { z } from 'zod';
import * as schemas from './schemas';

// Validation helpers
export function validateLogin(data: unknown) {
  return schemas.loginSchema.safeParse(data);
}

export function validateRegister(data: unknown) {
  return schemas.registerSchema.safeParse(data);
}

export function validateSubject(data: unknown) {
  return schemas.createSubjectSchema.safeParse(data);
}

export function validateStudyCycle(data: unknown) {
  return schemas.createStudyCycleSchema.safeParse(data);
}

// Generic validation helper
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError['errors'];
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
}

// Validation error formatter
export function formatValidationErrors(errors: z.ZodError['errors']): Record<string, string> {
  const formatted: Record<string, string> = {};

  errors.forEach((error: any) => {
    const path = error.path.join('.');
    formatted[path] = error.message;
  });

  return formatted;
}

// Password strength validator
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number; // 0-4
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain at least one lowercase letter');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain at least one uppercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain at least one number');
  }

  // Special character check
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain at least one special character');
  }

  return {
    isValid: score >= 3, // Require at least 3 criteria
    score,
    feedback
  };
}

// Email availability check (mock - would be implemented with API call)
export async function checkEmailAvailability(email: string): Promise<boolean> {
  // This would make an API call to check if email is available
  // For now, just validate format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Username availability check (mock)
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  // This would make an API call to check if username is available
  // For now, just basic validation
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// XSS prevention
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  return text.replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
}

// File validation
export function validateFile(file: File, options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxNameLength?: number;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Size check
  if (options.maxSize && file.size > options.maxSize) {
    errors.push(`File size must be less than ${options.maxSize / 1024 / 1024}MB`);
  }

  // Type check
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
  }

  // Name length check
  if (options.maxNameLength && file.name.length > options.maxNameLength) {
    errors.push(`File name must be less than ${options.maxNameLength} characters`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Phone number validation (basic)
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Date validation
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString.slice(0, 10));
}

// Age validation
export function isValidAge(birthDate: string, minAge: number = 13): boolean {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge;
  }

  return age >= minAge;
}

// Study time validation
export function isValidStudyTime(timeString: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
}

// Duration validation (in minutes)
export function isValidDuration(minutes: number, maxHours: number = 12): boolean {
  return minutes > 0 && minutes <= maxHours * 60;
}
