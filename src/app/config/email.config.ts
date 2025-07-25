/**
 * Email Configuration for DriveLink Auto
 * 
 * This file contains all email-related configuration for your website.
 * Update the EmailJS credentials when you set up your EmailJS account.
 */

export interface EmailConfig {
  // Company Email Addresses
  companyEmails: {
    main: string;
    sales: string;
    service: string;
    support: string;
    noreply: string;
  };
  
  // EmailJS Configuration
  emailJS: {
    serviceId: string;
    templateIds: {
      contact: string;
      quote: string;
      service: string;
      newsletter: string;
    };
    publicKey: string;
  };
  
  // SMTP Configuration (for backend integration)
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      // Note: Never store passwords in frontend code
      // This should be handled by your backend service
    };
  };
}

export const EMAIL_CONFIG: EmailConfig = {
  // Your DriveLink Auto Email Addresses
  companyEmails: {
    main: 'info@drivelinkauto.co.za',
    sales: 'sales@drivelinkauto.co.za',
    service: 'service@drivelinkauto.co.za',
    support: 'support@drivelinkauto.co.za',
    noreply: 'noreply@drivelinkauto.co.za'
  },
  
  // EmailJS Configuration
  // You need to:
  // 1. Sign up at https://www.emailjs.com/
  // 2. Create a service (Gmail, Outlook, or SMTP)
  // 3. Create email templates
  // 4. Get your public key
  // 5. Update these values
  emailJS: {
    serviceId: 'service_drivelink', // Replace with your EmailJS service ID
    templateIds: {
      contact: 'template_contact',     // Contact form template
      quote: 'template_quote',         // Quote request template
      service: 'template_service',     // Service appointment template
      newsletter: 'template_newsletter' // Newsletter subscription template
    },
    publicKey: 'your_emailjs_public_key' // Replace with your EmailJS public key
  },
  
  // SMTP Configuration for your hosting
  // Based on your hosting details from domains.co.za
  smtp: {
    host: 'mail.drivelinkauto.co.za',
    port: 587, // or 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'info@drivelinkauto.co.za'
      // Password should be handled securely by backend
    }
  }
};

/**
 * Email Template Variables
 * These are the variables you can use in your EmailJS templates
 */
export const EMAIL_TEMPLATE_VARIABLES = {
  contact: [
    'to_email',
    'to_name',
    'from_name',
    'from_email',
    'phone',
    'subject',
    'message',
    'service',
    'reply_to',
    'company_name',
    'website'
  ],
  
  quote: [
    'to_email',
    'to_name',
    'from_name',
    'from_email',
    'phone',
    'subject',
    'vehicle_make',
    'vehicle_model',
    'vehicle_year',
    'budget_range',
    'financing_needed',
    'trade_in',
    'additional_notes',
    'reply_to',
    'company_name'
  ],
  
  service: [
    'to_email',
    'to_name',
    'from_name',
    'from_email',
    'phone',
    'subject',
    'service_type',
    'vehicle_info',
    'preferred_date',
    'preferred_time',
    'description',
    'reply_to',
    'company_name'
  ],
  
  newsletter: [
    'to_email',
    'to_name',
    'subscriber_name',
    'subscriber_email',
    'subject',
    'message',
    'company_name'
  ]
};

/**
 * Default Email Subjects
 */
export const DEFAULT_EMAIL_SUBJECTS = {
  general: 'General Inquiry - DriveLink Auto',
  sales: 'Vehicle Sales Inquiry - DriveLink Auto',
  service: 'Service Request - DriveLink Auto',
  support: 'Support Request - DriveLink Auto',
  quote: 'Vehicle Quote Request - DriveLink Auto',
  callback: 'Callback Request - DriveLink Auto',
  newsletter: 'Newsletter Subscription - DriveLink Auto'
};

/**
 * Email Validation Patterns
 */
export const EMAIL_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  southAfricanPhone: /^(\+27|0)[1-9]\d{8}$/
};