import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const validatePhone = (phone: string, country?: string): boolean => {
  try {
    return isValidPhoneNumber(phone, country as any);
  } catch {
    return false;
  }
};

export const formatPhone = (phone: string, country?: string): string => {
  try {
    const phoneNumber = parsePhoneNumber(phone, country as any);
    return phoneNumber.formatInternational();
  } catch {
    return phone;
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const normalizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};