
// Simple HTML sanitization utility to prevent XSS
export const sanitizeHtml = (input: string): string => {
  // Create a temporary element to parse HTML
  const temp = document.createElement('div');
  temp.textContent = input;
  
  // Remove any potentially dangerous content
  return temp.innerHTML
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 2000); // Limit input length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 128;
};
