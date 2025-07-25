import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';
import { EMAIL_CONFIG, DEFAULT_EMAIL_SUBJECTS } from '../config/email.config';

export interface EmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  service?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class Email {
  // Company Email Configuration from config file
  private readonly COMPANY_EMAIL = EMAIL_CONFIG.companyEmails.main;
  private readonly SALES_EMAIL = EMAIL_CONFIG.companyEmails.sales;
  private readonly SERVICE_EMAIL = EMAIL_CONFIG.companyEmails.service;
  private readonly SUPPORT_EMAIL = EMAIL_CONFIG.companyEmails.support;
  
  // EmailJS Configuration from config file
  private readonly SERVICE_ID = EMAIL_CONFIG.emailJS.serviceId;
  private readonly TEMPLATE_ID = EMAIL_CONFIG.emailJS.templateIds.contact;
  private readonly PUBLIC_KEY = EMAIL_CONFIG.emailJS.publicKey;

  constructor() {
    // Initialize EmailJS
    emailjs.init(this.PUBLIC_KEY);
  }

  /**
   * Send email using EmailJS
   */
  async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      const templateParams = {
        to_email: this.COMPANY_EMAIL,
        to_name: 'DriveLink Auto Team',
        from_name: emailData.name,
        from_email: emailData.email,
        phone: emailData.phone || 'Not provided',
        subject: emailData.subject,
        message: emailData.message,
        service: emailData.service || 'General Inquiry',
        reply_to: emailData.email,
        company_name: 'DriveLink Auto',
        website: 'drivelinkauto.co.za'
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams
      );

      return {
        success: true,
        message: 'Email sent successfully! We will get back to you soon.',
        data: response
      };
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again or contact us directly.',
        data: error
      };
    }
  }

  /**
   * Send quote request email
   */
  async sendQuoteRequest(quoteData: any): Promise<EmailResponse> {
    try {
      const templateParams = {
        to_email: this.SALES_EMAIL,
        to_name: 'DriveLink Sales Team',
        from_name: quoteData.name,
        from_email: quoteData.email,
        phone: quoteData.phone || 'Not provided',
        subject: 'Vehicle Quote Request',
        vehicle_make: quoteData.vehicleMake,
        vehicle_model: quoteData.vehicleModel,
        vehicle_year: quoteData.vehicleYear,
        budget_range: quoteData.budgetRange,
        financing_needed: quoteData.financingNeeded ? 'Yes' : 'No',
        trade_in: quoteData.tradeIn ? 'Yes' : 'No',
        additional_notes: quoteData.additionalNotes || 'None',
        reply_to: quoteData.email,
        company_name: 'DriveLink Auto'
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        EMAIL_CONFIG.emailJS.templateIds.quote,
        templateParams
      );

      return {
        success: true,
        message: 'Quote request sent successfully! Our team will contact you with a personalized quote.',
        data: response
      };
    } catch (error: any) {
      console.error('Quote Email Error:', error);
      return {
        success: false,
        message: 'Failed to send quote request. Please try again.',
        data: error
      };
    }
  }

  /**
   * Send service appointment email
   */
  async sendServiceAppointment(appointmentData: any): Promise<EmailResponse> {
    try {
      const templateParams = {
        to_email: this.SERVICE_EMAIL,
        to_name: 'DriveLink Service Team',
        from_name: appointmentData.name,
        from_email: appointmentData.email,
        phone: appointmentData.phone,
        subject: 'Service Appointment Request',
        service_type: appointmentData.serviceType,
        vehicle_info: `${appointmentData.vehicleMake} ${appointmentData.vehicleModel} (${appointmentData.vehicleYear})`,
        preferred_date: appointmentData.preferredDate,
        preferred_time: appointmentData.preferredTime,
        description: appointmentData.description || 'No additional details provided',
        reply_to: appointmentData.email,
        company_name: 'DriveLink Auto'
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        EMAIL_CONFIG.emailJS.templateIds.service,
        templateParams
      );

      return {
        success: true,
        message: 'Service appointment request sent! We will confirm your appointment soon.',
        data: response
      };
    } catch (error: any) {
      console.error('Service Email Error:', error);
      return {
        success: false,
        message: 'Failed to send service appointment request. Please try again.',
        data: error
      };
    }
  }

  /**
   * Send newsletter subscription
   */
  async subscribeNewsletter(email: string, name?: string): Promise<EmailResponse> {
    try {
      const templateParams = {
        to_email: this.COMPANY_EMAIL,
        to_name: 'DriveLink Marketing Team',
        subscriber_name: name || 'New Subscriber',
        subscriber_email: email,
        subject: 'New Newsletter Subscription',
        message: `New newsletter subscription from ${name || 'a visitor'} (${email})`,
        company_name: 'DriveLink Auto'
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        EMAIL_CONFIG.emailJS.templateIds.newsletter,
        templateParams
      );

      return {
        success: true,
        message: 'Successfully subscribed to our newsletter!',
        data: response
      };
    } catch (error: any) {
      console.error('Newsletter Email Error:', error);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again.',
        data: error
      };
    }
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Format phone number for display
   */
  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  /**
   * Send email directly using company SMTP (for backend integration)
   */
  async sendCompanyEmail(emailData: EmailData): Promise<EmailResponse> {
    // This method would be used with a backend service
    // For now, it falls back to EmailJS
    return this.sendEmail(emailData);
  }

  /**
   * Get company email addresses
   */
  getCompanyEmails() {
    return EMAIL_CONFIG.companyEmails;
  }

  /**
   * Generate mailto link for direct email
   */
  generateMailtoLink(to: string, subject: string = '', body: string = ''): string {
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (body) params.append('body', body);
    
    const queryString = params.toString();
    return `mailto:${to}${queryString ? '?' + queryString : ''}`;
  }

  /**
   * Open email client with pre-filled data
   */
  openEmailClient(type: 'general' | 'sales' | 'service' | 'support' = 'general', subject?: string, body?: string): void {
    const emailMap = {
      general: this.COMPANY_EMAIL,
      sales: this.SALES_EMAIL,
      service: this.SERVICE_EMAIL,
      support: this.SUPPORT_EMAIL
    };
    
    const defaultSubjects = {
      general: DEFAULT_EMAIL_SUBJECTS.general,
      sales: DEFAULT_EMAIL_SUBJECTS.sales,
      service: DEFAULT_EMAIL_SUBJECTS.service,
      support: DEFAULT_EMAIL_SUBJECTS.support
    };
    
    const emailTo = emailMap[type];
    const emailSubject = subject || defaultSubjects[type];
    const emailBody = body || `Hello DriveLink Auto Team,\n\nI would like to inquire about your services.\n\nBest regards`;
    
    const mailtoLink = this.generateMailtoLink(emailTo, emailSubject, emailBody);
    window.open(mailtoLink, '_self');
  }

  /**
   * Get email template preview (for testing)
   */
  getTemplatePreview(type: 'contact' | 'quote' | 'service' | 'newsletter'): string {
    const templates = {
      contact: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; text-align: center;">
            <h1>DriveLink Auto</h1>
            <h2>New Contact Form Submission</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p><strong>Customer Name:</strong> {{from_name}}</p>
            <p><strong>Email:</strong> <a href="mailto:{{from_email}}">{{from_email}}</a></p>
            <p><strong>Phone:</strong> <a href="tel:{{phone}}">{{phone}}</a></p>
            <p><strong>Service Interest:</strong> {{service}}</p>
            <p><strong>Subject:</strong> {{subject}}</p>
            <div style="background: white; padding: 15px; border-left: 4px solid #2a5298; margin: 15px 0;">
              <strong>Message:</strong><br>
              {{message}}
            </div>
            <p style="color: #666; font-size: 12px;">Sent from: {{website}}</p>
          </div>
        </div>
      `,
      quote: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; text-align: center;">
            <h1>DriveLink Auto</h1>
            <h2>Vehicle Quote Request</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h3 style="color: #2a5298;">Customer Information</h3>
            <p><strong>Name:</strong> {{from_name}}</p>
            <p><strong>Email:</strong> <a href="mailto:{{from_email}}">{{from_email}}</a></p>
            <p><strong>Phone:</strong> <a href="tel:{{phone}}">{{phone}}</a></p>
            
            <h3 style="color: #2a5298;">Vehicle Details</h3>
            <p><strong>Vehicle:</strong> {{vehicle_year}} {{vehicle_make}} {{vehicle_model}}</p>
            <p><strong>Budget Range:</strong> {{budget_range}}</p>
            <p><strong>Financing Needed:</strong> {{financing_needed}}</p>
            <p><strong>Trade-in Vehicle:</strong> {{trade_in}}</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #2a5298; margin: 15px 0;">
              <strong>Additional Notes:</strong><br>
              {{additional_notes}}
            </div>
          </div>
        </div>
      `,
      service: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; text-align: center;">
            <h1>DriveLink Auto</h1>
            <h2>Service Appointment Request</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h3 style="color: #2a5298;">Customer Information</h3>
            <p><strong>Name:</strong> {{from_name}}</p>
            <p><strong>Email:</strong> <a href="mailto:{{from_email}}">{{from_email}}</a></p>
            <p><strong>Phone:</strong> <a href="tel:{{phone}}">{{phone}}</a></p>
            
            <h3 style="color: #2a5298;">Service Details</h3>
            <p><strong>Service Type:</strong> {{service_type}}</p>
            <p><strong>Vehicle:</strong> {{vehicle_info}}</p>
            <p><strong>Preferred Date:</strong> {{preferred_date}}</p>
            <p><strong>Preferred Time:</strong> {{preferred_time}}</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #2a5298; margin: 15px 0;">
              <strong>Service Description:</strong><br>
              {{description}}
            </div>
          </div>
        </div>
      `,
      newsletter: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; text-align: center;">
            <h1>DriveLink Auto</h1>
            <h2>New Newsletter Subscription</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p><strong>Subscriber Name:</strong> {{subscriber_name}}</p>
            <p><strong>Email Address:</strong> <a href="mailto:{{subscriber_email}}">{{subscriber_email}}</a></p>
            <p><strong>Subscription Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="color: #666; font-size: 12px;">Add this subscriber to your mailing list.</p>
          </div>
        </div>
      `
    };
    
    return templates[type];
  }
}
