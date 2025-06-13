import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Email, EmailResponse } from '../../services/email';
import { CommonModule } from '@angular/common';
import { Contact as ContactService } from '../../services/contact';

interface ContactInfo {
  icon: string;
  title: string;
  details: string[];
  action?: () => void;
}

interface ServiceArea {
  city: string;
  region: string;
  coverage: string;
}

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements OnInit, OnDestroy {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';
  showSuccessMessage = false;

  // Contact Information
  contactInfo: ContactInfo[] = [
    {
      icon: 'bi-geo-alt-fill',
      title: 'Visit Our Offices',
      details: [
        '123 Main Street, Johannesburg',
        'Cape Town Branch: 456 Ocean Drive',
        'Durban Office: 789 Harbor View'
      ],
      action: () => this.openLocationMap()
    },
    {
      icon: 'bi-telephone-fill',
      title: 'Call Us Directly',
      details: [
        '+27 11 123 4567 (Johannesburg)',
        '+27 21 987 6543 (Cape Town)',
        '+27 31 555 0123 (Durban)'
      ],
      action: () => this.callUs()
    },
    {
      icon: 'bi-envelope-fill',
      title: 'Email Support',
      details: [
        'info@drivelink.co.za',
        'sales@drivelink.co.za',
        'support@drivelink.co.za'
      ],
      action: () => this.openEmail()
    },
    {
      icon: 'bi-clock-fill',
      title: 'Business Hours',
      details: [
        'Monday - Friday: 8:00 AM - 6:00 PM',
        'Saturday: 9:00 AM - 4:00 PM',
        'Sunday: 10:00 AM - 2:00 PM'
      ]
    }
  ];

  // Service Areas
  serviceAreas: ServiceArea[] = [
    { city: 'Johannesburg', region: 'Gauteng', coverage: '50km radius' },
    { city: 'Cape Town', region: 'Western Cape', coverage: '60km radius' },
    { city: 'Durban', region: 'KwaZulu-Natal', coverage: '45km radius' },
    { city: 'Pretoria', region: 'Gauteng', coverage: '40km radius' },
    { city: 'Port Elizabeth', region: 'Eastern Cape', coverage: '35km radius' },
    { city: 'Bloemfontein', region: 'Free State', coverage: '30km radius' }
  ];

  // FAQ Items
  faqItems = [
    {
      question: 'How long does vehicle import typically take?',
      answer: 'Vehicle import process usually takes 6-8 weeks from order confirmation to delivery, depending on the origin country and vehicle specifications.',
      isOpen: false
    },
    {
      question: 'Do you provide financing options?',
      answer: 'Yes, we work with multiple financial institutions to provide competitive financing options. Our team can help you find the best rates and terms.',
      isOpen: false
    },
    {
      question: 'What documentation do I need for vehicle export?',
      answer: 'Required documents include vehicle registration, proof of ownership, export permit, and compliance certificates. We handle most paperwork for you.',
      isOpen: false
    },
    {
      question: 'Can I track my vehicle shipment?',
      answer: 'Absolutely! We provide real-time tracking information and regular updates throughout the shipping process via our customer portal.',
      isOpen: false
    },
    {
      question: 'Do you offer warranty on imported vehicles?',
      answer: 'Yes, we provide comprehensive warranty coverage on all our imported vehicles, with options for extended warranty packages.',
      isOpen: false
    }
  ];

  constructor(
    private fb: FormBuilder,
    private emailService: Email,
    private contactService: ContactService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      service: ['general', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      newsletter: [false],
      terms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Only initialize AOS on the browser platform
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAOS();
    }
  }

  private async initializeAOS(): Promise<void> {
    try {
      // Dynamic import for AOS to avoid SSR issues
      const AOS = await import('aos');
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
      });
    } catch (error) {
      console.warn('AOS could not be initialized:', error);
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // Form Submission
  async onSubmit(): Promise<void> {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = '';

      try {
        const formData = this.contactForm.value;
        
        // Send email
        const emailResponse: EmailResponse = await this.emailService.sendEmail({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          service: formData.service
        });

        if (emailResponse.success) {
          this.submitSuccess = true;
          this.showSuccessMessage = true;
          this.contactForm.reset();
          
          // Handle newsletter subscription
          if (formData.newsletter) {
            await this.emailService.subscribeNewsletter(formData.email, formData.name);
          }

          // Hide success message after 5 seconds
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 5000);

        } else {
          this.submitError = emailResponse.message;
        }
      } catch (error) {
        this.submitError = 'An unexpected error occurred. Please try again.';
        console.error('Contact form error:', error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  // Form Validation Helpers
  markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field && field.touched && field.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['pattern'] && fieldName === 'phone') return 'Please enter a valid phone number';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.touched && field.errors);
  }

  // Contact Actions
  openLocationMap(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://maps.google.com/search/DriveLink+Johannesburg', '_blank');
    }
  }

  callUs(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('tel:+27111234567', '_self');
    }
  }

  openEmail(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('mailto:info@drivelink.co.za', '_self');
    }
  }

  openWhatsApp(): void {
    if (isPlatformBrowser(this.platformId)) {
      const message = encodeURIComponent('Hi! I would like to inquire about your services.');
      window.open(`https://wa.me/27111234567?text=${message}`, '_blank');
    }
  }

  openMessenger(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://m.me/drivelink', '_blank');
    }
  }

  // FAQ Toggle
  toggleFaq(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }

  // Quick Actions
  requestQuote(): void {
    // This would typically open a quote modal
    this.openQuoteModal();
  }

  openQuoteModal(): void {
    // Implement modal opening logic here
    if (isPlatformBrowser(this.platformId)) {
      alert('Quote modal feature coming soon!');
    }
  }

  scheduleCallback(): void {
    const phone = this.contactForm.get('phone')?.value;
    if (phone) {
      const message = `Please schedule a callback for ${phone}`;
      this.contactForm.patchValue({ 
        subject: 'Callback Request',
        message: message,
        service: 'callback'
      });
    }
  }

  // Live Chat Simulation
  startLiveChat(): void {
    // Simulate live chat opening
    if (isPlatformBrowser(this.platformId)) {
      alert('Live chat feature coming soon! Please use our contact form or call us directly.');
    }
  }

  // Social Media Actions
  shareOnSocial(platform: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('Check out DriveLink - Your trusted vehicle import/export partner!');
      
      const socialUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        whatsapp: `https://wa.me/?text=${text}%20${url}`
      };

      if (socialUrls[platform as keyof typeof socialUrls]) {
        window.open(socialUrls[platform as keyof typeof socialUrls], '_blank');
      }
    }
  }

  // Utility Functions
  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 10) {
      value = value.substring(0, 10);
      const formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
      this.contactForm.patchValue({ phone: formatted });
    }
  }

  validateRealTimeEmail(): void {
    const emailControl = this.contactForm.get('email');
    if (emailControl && emailControl.value) {
      const isValid = this.emailService.validateEmail(emailControl.value);
      if (!isValid && emailControl.touched) {
        emailControl.setErrors({ email: true });
      }
    }
  }

  // Character Counter
  getMessageCharCount(): string {
    const message = this.contactForm.get('message')?.value || '';
    return `${message.length}/500`;
  }

  // Auto-suggest for common subjects
  getSubjectSuggestions(): string[] {
    return [
      'Vehicle Import Inquiry',
      'Export Documentation Help',
      'Financing Options',
      'Shipping Quote Request',
      'Technical Support',
      'Partnership Opportunity',
      'General Information'
    ];
  }

  selectSuggestedSubject(subject: string): void {
    this.contactForm.patchValue({ subject });
  }
}