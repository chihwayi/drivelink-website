import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Contact, ContactInfo } from '../../services/contact';
import { Email } from '../../services/email';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer implements OnInit, OnDestroy {
  contactInfo: ContactInfo | null = null;
  newsletterForm!: FormGroup;
  isSubmittingNewsletter = false;
  newsletterMessage = '';
  currentYear = new Date().getFullYear();
  businessStatus = '';
  
  private destroy$ = new Subject<void>();

  // Quick links for different sections
  quickLinks = [
    { title: 'Home', route: '/', fragment: 'hero' },
    { title: 'About Us', route: '/', fragment: 'about' },
    { title: 'Services', route: '/', fragment: 'services' },
    { title: 'Vehicles', route: '/', fragment: 'vehicles' },
    { title: 'Contact', route: '/', fragment: 'contact' }
  ];

  // Service links
  serviceLinks = [
    { title: 'Vehicle Import', route: '/services', fragment: 'import' },
    { title: 'Vehicle Export', route: '/services', fragment: 'export' },
    { title: 'Logistics', route: '/services', fragment: 'logistics' },
    { title: 'Documentation', route: '/services', fragment: 'documentation' },
    { title: 'Financing', route: '/services', fragment: 'financing' }
  ];

  // Legal links
  legalLinks = [
    { title: 'Privacy Policy', route: '/' },
    { title: 'Terms of Service', route: '/' },
    { title: 'Cookie Policy', route: '/' },
    { title: 'Disclaimer', route: '/' }
  ];

  constructor(
    private fb: FormBuilder,
    private contactService: Contact,
    private emailService: Email
  ) {
    this.initializeNewsletterForm();
  }

  ngOnInit(): void {
    this.loadContactInfo();
    this.updateBusinessStatus();
    
    // Update business status every minute
    setInterval(() => {
      this.updateBusinessStatus();
    }, 60000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize newsletter subscription form
   */
  private initializeNewsletterForm(): void {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['']
    });
  }

  /**
   * Load contact information from service
   */
  private loadContactInfo(): void {
    this.contactService.getContactInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe(contactInfo => {
        this.contactInfo = contactInfo;
      });
  }

  /**
   * Update business status
   */
  private updateBusinessStatus(): void {
    this.businessStatus = this.contactService.getBusinessStatus();
  }

  /**
   * Subscribe to newsletter
   */
  async subscribeNewsletter(): Promise<void> {
    if (this.newsletterForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmittingNewsletter = true;
    this.newsletterMessage = '';

    try {
      const formValue = this.newsletterForm.value;
      const response = await this.emailService.subscribeNewsletter(
        formValue.email,
        formValue.name
      );

      if (response.success) {
        this.newsletterMessage = response.message;
        this.newsletterForm.reset();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.newsletterMessage = '';
        }, 5000);
      } else {
        this.newsletterMessage = response.message;
      }
    } catch (error) {
      this.newsletterMessage = 'Failed to subscribe. Please try again.';
      console.error('Newsletter subscription error:', error);
    } finally {
      this.isSubmittingNewsletter = false;
    }
  }

  /**
   * Mark all form controls as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.newsletterForm.controls).forEach(key => {
      const control = this.newsletterForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Check if form field has error
   */
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.newsletterForm.get(fieldName);
    if (errorType) {
      return !!(field?.hasError(errorType) && field?.touched);
    }
    return !!(field?.invalid && field?.touched);
  }

  /**
   * Get error message for form field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.newsletterForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  /**
   * Open WhatsApp chat
   */
  openWhatsApp(): void {
    this.contactService.openWhatsApp('Hello! I found your website and would like to know more about your services.');
  }

  openDeveloperWhatsApp(): void {
    this.contactService.openDeveloperWhatsApp('Hello! I found this website that you developed, i would like to know more about your services.');
  }

  /**
   * Make phone call
   */
  makePhoneCall(): void {
    this.contactService.makePhoneCall();
  }

  /**
   * Send email
   */
  sendEmail(): void {
    this.contactService.sendEmail('General Inquiry from Website');
  }

  /**
   * Get directions to office
   */
  getDirections(): void {
    this.contactService.getDirections();
  }

  /**
   * View location on map
   */
  viewLocation(): void {
    this.contactService.viewLocation();
  }

  /**
   * Open social media pages
   */
  openFacebook(): void {
    this.contactService.openFacebookPage();
  }

  openInstagram(): void {
    this.contactService.openInstagram();
  }

  openTwitter(): void {
    this.contactService.openTwitter();
  }

  openLinkedIn(): void {
    this.contactService.openLinkedIn();
  }

  openYouTube(): void {
    this.contactService.openYouTube();
  }

  openMessenger(): void {
    this.contactService.openMessenger();
  }

  /**
   * Scroll to section
   */
  scrollToSection(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Scroll to top of page
   */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phone: string): string {
    return this.contactService.formatPhoneNumber(phone);
  }

  /**
   * Get business hours for today
   */
  getTodayHours(): string {
    if (!this.contactInfo) return '';
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return (this.contactInfo.businessHours as any)[today] || 'Contact us';
  }

  /**
   * Check if email is valid
   */
  isValidEmail(email: string): boolean {
    return this.emailService.validateEmail(email);
  }

  /**
   * Get current business status with next opening info
   */
  getBusinessStatusWithNext(): string {
    const status = this.contactService.getBusinessStatus();
    if (status === 'Closed') {
      const nextOpening = this.contactService.getNextOpeningTime();
      return `${status}${nextOpening ? ` - ${nextOpening}` : ''}`;
    }
    return status;
  }
}
