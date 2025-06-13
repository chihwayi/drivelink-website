import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';

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
  private readonly SERVICE_ID = 'your_service_id'; // Replace with your EmailJS service ID
  private readonly TEMPLATE_ID = 'your_template_id'; // Replace with your EmailJS template ID
  private readonly PUBLIC_KEY = 'your_public_key'; // Replace with your EmailJS public key

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
        to_name: 'DriveLink Team',
        from_name: emailData.name,
        from_email: emailData.email,
        phone: emailData.phone || 'Not provided',
        subject: emailData.subject,
        message: emailData.message,
        service: emailData.service || 'General Inquiry',
        reply_to: emailData.email
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
        reply_to: quoteData.email
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        'quote_template_id', // You'll need a separate template for quotes
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
        reply_to: appointmentData.email
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        'service_template_id', // You'll need a separate template for service appointments
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
        to_name: 'DriveLink Marketing Team',
        subscriber_name: name || 'New Subscriber',
        subscriber_email: email,
        subject: 'New Newsletter Subscription',
        message: `New newsletter subscription from ${name || 'a visitor'} (${email})`
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        'newsletter_template_id', // You'll need a separate template for newsletter
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
   * Get email template preview (for testing)
   */
  getTemplatePreview(type: 'contact' | 'quote' | 'service' | 'newsletter'): string {
    const templates = {
      contact: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {{from_name}}</p>
        <p><strong>Email:</strong> {{from_email}}</p>
        <p><strong>Phone:</strong> {{phone}}</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        <p><strong>Message:</strong> {{message}}</p>
      `,
      quote: `
        <h2>Vehicle Quote Request</h2>
        <p><strong>Customer:</strong> {{from_name}} ({{from_email}})</p>
        <p><strong>Phone:</strong> {{phone}}</p>
        <p><strong>Vehicle:</strong> {{vehicle_year}} {{vehicle_make}} {{vehicle_model}}</p>
        <p><strong>Budget Range:</strong> {{budget_range}}</p>
        <p><strong>Financing Needed:</strong> {{financing_needed}}</p>
        <p><strong>Trade-in:</strong> {{trade_in}}</p>
        <p><strong>Notes:</strong> {{additional_notes}}</p>
      `,
      service: `
        <h2>Service Appointment Request</h2>
        <p><strong>Customer:</strong> {{from_name}} ({{from_email}})</p>
        <p><strong>Phone:</strong> {{phone}}</p>
        <p><strong>Service Type:</strong> {{service_type}}</p>
        <p><strong>Vehicle:</strong> {{vehicle_info}}</p>
        <p><strong>Preferred Date:</strong> {{preferred_date}}</p>
        <p><strong>Preferred Time:</strong> {{preferred_time}}</p>
        <p><strong>Description:</strong> {{description}}</p>
      `,
      newsletter: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Name:</strong> {{subscriber_name}}</p>
        <p><strong>Email:</strong> {{subscriber_email}}</p>
      `
    };
    
    return templates[type];
  }
}
