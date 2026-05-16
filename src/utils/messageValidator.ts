/**
 * Message Validator
 * Validates contact form data before submission
 */

export interface MessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate message data
 */
export const validateMessage = (data: MessageData): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'الاسم مطلوب';
  } else if (data.name.trim().length < 2) {
    errors.name = 'الاسم يجب أن يكون حرفين على الأقل';
  } else if (data.name.trim().length > 100) {
    errors.name = 'الاسم يجب أن لا يتجاوز 100 حرف';
  }

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'البريد الإلكتروني مطلوب';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'البريد الإلكتروني غير صالح';
    }
  }

  // Validate subject
  if (!data.subject || data.subject.trim().length === 0) {
    errors.subject = 'الموضوع مطلوب';
  } else if (data.subject.trim().length < 3) {
    errors.subject = 'الموضوع يجب أن يكون 3 أحرف على الأقل';
  } else if (data.subject.trim().length > 200) {
    errors.subject = 'الموضوع يجب أن لا يتجاوز 200 حرف';
  }

  // Validate message
  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'الرسالة مطلوبة';
  } else if (data.message.trim().length < 10) {
    errors.message = 'الرسالة يجب أن تكون 10 أحرف على الأقل';
  } else if (data.message.trim().length > 5000) {
    errors.message = 'الرسالة يجب أن لا تتجاوز 5000 حرف';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize message data
 */
export const sanitizeMessageData = (data: MessageData): MessageData => {
  return {
    name: data.name.trim().replace(/[<>]/g, ''),
    email: data.email.trim().toLowerCase(),
    subject: data.subject.trim().replace(/[<>]/g, ''),
    message: data.message.trim().replace(/[<>]/g, ''),
  };
};

/**
 * Check if message contains spam keywords
 */
export const isSpam = (data: MessageData): boolean => {
  const spamKeywords = [
    'viagra', 'casino', 'lottery', 'winner', 'free money',
    'click here', 'subscribe', 'unsubscribe', 'buy now',
    'limited time', 'act now', 'congratulations',
  ];

  const combinedText = `${data.name} ${data.subject} ${data.message}`.toLowerCase();
  
  return spamKeywords.some(keyword => combinedText.includes(keyword));
};