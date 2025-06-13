import { 
  Component, 
  OnInit, 
  OnDestroy, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChild, 
  ElementRef,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact } from '../../../services/contact';
import { Email } from '../../../services/email';
import { CommonModule } from '@angular/common';

export interface QuoteFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Vehicle Information
  vehicleType: string;
  make: string;
  model: string;
  year: number;
  condition: string;
  
  // Service Information
  serviceType: string;
  origin: string;
  destination: string;
  preferredTimeframe: string;
  
  // Additional Information
  additionalRequests?: string;
  budget?: string;
  
  // Preferences
  contactPreference: string;
  newsletter: boolean;
}

export interface VehicleOption {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-quote-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './quote-modal.html',
  styleUrl: './quote-modal.scss'
})
export class QuoteModal implements OnInit, OnDestroy {
  @Input() isVisible: boolean = false;
  @Input() selectedVehicleType?: string;
  @Output() close = new EventEmitter<void>();
  @Output() quoteSubmitted = new EventEmitter<QuoteFormData>();
  
  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef;
  @ViewChild('quoteForm', { static: false }) quoteForm!: ElementRef;

  quoteForm$!: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 4;
  isSubmitting: boolean = false;
  isSuccess: boolean = false;
  submitError: string = '';
  
  // Form validation states
  formErrors: { [key: string]: string } = {};
  touchedFields: Set<string> = new Set();

  maxYear: number = new Date().getFullYear() + 1;

  // Vehicle options
  vehicleTypes: VehicleOption[] = [
    { value: 'sedan', label: 'Sedan', icon: 'bi-car-front' },
    { value: 'suv', label: 'SUV', icon: 'bi-truck' },
    { value: 'truck', label: 'Truck', icon: 'bi-truck-front' },
    { value: 'luxury', label: 'Luxury Car', icon: 'bi-gem' },
    { value: 'commercial', label: 'Commercial Vehicle', icon: 'bi-bus-front' },
    { value: 'motorcycle', label: 'Motorcycle', icon: 'bi-bicycle' },
    { value: 'other', label: 'Other', icon: 'bi-question-circle' }
  ];

  serviceTypes: VehicleOption[] = [
    { value: 'import', label: 'Vehicle Import', icon: 'bi-arrow-down-circle' },
    { value: 'export', label: 'Vehicle Export', icon: 'bi-arrow-up-circle' },
    { value: 'shipping', label: 'Shipping Only', icon: 'bi-ship' },
    { value: 'documentation', label: 'Documentation', icon: 'bi-file-earmark-text' },
    { value: 'full-service', label: 'Full Service Package', icon: 'bi-check-all' }
  ];

  vehicleConditions: string[] = [
    'New',
    'Like New',
    'Excellent',
    'Good',
    'Fair',
    'Needs Work'
  ];

  timeframes: string[] = [
    'ASAP',
    'Within 1 week',
    'Within 2 weeks',
    'Within 1 month',
    'Within 2-3 months',
    'Flexible'
  ];

  contactPreferences: VehicleOption[] = [
    { value: 'email', label: 'Email', icon: 'bi-envelope' },
    { value: 'phone', label: 'Phone Call', icon: 'bi-telephone' },
    { value: 'whatsapp', label: 'WhatsApp', icon: 'bi-whatsapp' },
    { value: 'any', label: 'Any Method', icon: 'bi-chat-dots' }
  ];

  // Popular makes for autocomplete
  popularMakes: string[] = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz',
    'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus',
    'Infiniti', 'Acura', 'Volvo', 'Jaguar', 'Land Rover', 'Porsche'
  ];

  // Animation states
  slideDirection: 'left' | 'right' = 'right';
  isAnimating: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contactService: Contact,
    private emailService: Email,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.selectedVehicleType) {
      this.quoteForm$.patchValue({ vehicleType: this.selectedVehicleType });
    }
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions or timers if needed
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.isVisible && !this.isSubmitting) {
      this.closeModal();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isVisible && event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  private initializeForm(): void {
    this.quoteForm$ = this.fb.group({
      // Step 1: Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      
      // Step 2: Vehicle Information
      vehicleType: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear() + 1)]],
      condition: ['', Validators.required],
      
      // Step 3: Service Information
      serviceType: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      preferredTimeframe: ['', Validators.required],
      
      // Step 4: Additional Information
      additionalRequests: [''],
      budget: [''],
      contactPreference: ['email'],
      newsletter: [false]
    });

    // Watch for form changes to update validation
    this.quoteForm$.valueChanges.subscribe(() => {
      this.updateFormErrors();
    });
  }

  // Step Navigation
  nextStep(): void {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.slideDirection = 'right';
        this.animateStep(() => {
          this.currentStep++;
          this.cdr.detectChanges();
        });
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.slideDirection = 'left';
      this.animateStep(() => {
        this.currentStep--;
        this.cdr.detectChanges();
      });
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps && step !== this.currentStep) {
      this.slideDirection = step > this.currentStep ? 'right' : 'left';
      this.animateStep(() => {
        this.currentStep = step;
        this.cdr.detectChanges();
      });
    }
  }

  private animateStep(callback: () => void): void {
    this.isAnimating = true;
    setTimeout(() => {
      callback();
      this.isAnimating = false;
    }, 150);
  }

  // Validation
  private validateCurrentStep(): boolean {
    const stepFields = this.getStepFields(this.currentStep);
    let isValid = true;

    stepFields.forEach(field => {
      const control = this.quoteForm$.get(field);
      if (control) {
        control.markAsTouched();
        this.touchedFields.add(field);
        if (control.invalid) {
          isValid = false;
        }
      }
    });

    this.updateFormErrors();
    return isValid;
  }

  private getStepFields(step: number): string[] {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone'];
      case 2:
        return ['vehicleType', 'make', 'model', 'year', 'condition'];
      case 3:
        return ['serviceType', 'origin', 'destination', 'preferredTimeframe'];
      case 4:
        return ['contactPreference'];
      default:
        return [];
    }
  }

  private updateFormErrors(): void {
    this.formErrors = {};
    Object.keys(this.quoteForm$.controls).forEach(key => {
      const control = this.quoteForm$.get(key);
      if (control && control.invalid && (control.dirty || control.touched || this.touchedFields.has(key))) {
        this.formErrors[key] = this.getErrorMessage(key, control.errors);
      }
    });
  }

  private getErrorMessage(fieldName: string, errors: any): string {
    if (errors['required']) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    if (errors['minlength']) {
      return `${this.getFieldDisplayName(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['pattern']) {
      return 'Please enter a valid phone number';
    }
    if (errors['min']) {
      return `Year must be ${errors['min'].min} or later`;
    }
    if (errors['max']) {
      return `Year cannot be later than ${errors['max'].max}`;
    }
    return 'Invalid input';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      vehicleType: 'Vehicle Type',
      make: 'Make',
      model: 'Model',
      year: 'Year',
      condition: 'Condition',
      serviceType: 'Service Type',
      origin: 'Origin',
      destination: 'Destination',
      preferredTimeframe: 'Preferred Timeframe',
      contactPreference: 'Contact Preference'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Form Submission
  async submitQuote(): Promise<void> {
    if (this.quoteForm$.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = '';

      try {
        const formData: QuoteFormData = this.quoteForm$.value;
        
        // Send email notification
        await this.emailService.sendQuoteRequest(formData);
        
        // Save to contact service
        await this.contactService.saveQuoteRequest(formData);
        
        this.isSuccess = true;
        this.quoteSubmitted.emit(formData);
        
        // Auto-close after success
        setTimeout(() => {
          this.closeModal();
        }, 3000);
        
      } catch (error) {
        console.error('Error submitting quote request:', error);
        this.submitError = 'Failed to submit quote request. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  // Modal Controls
  closeModal(): void {
    if (!this.isSubmitting) {
      this.close.emit();
      this.resetModal();
    }
  }

  private resetModal(): void {
    this.currentStep = 1;
    this.isSuccess = false;
    this.submitError = '';
    this.formErrors = {};
    this.touchedFields.clear();
    this.quoteForm$.reset();
    this.quoteForm$.patchValue({
      contactPreference: 'email',
      newsletter: false
    });
    
    if (this.selectedVehicleType) {
      this.quoteForm$.patchValue({ vehicleType: this.selectedVehicleType });
    }
  }

  // Utility Methods
  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Personal Information';
      case 2: return 'Vehicle Details';
      case 3: return 'Service Requirements';
      case 4: return 'Additional Information';
      default: return '';
    }
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  isStepCompleted(step: number): boolean {
    if (step > this.currentStep) return false;
    
    const stepFields = this.getStepFields(step);
    return stepFields.every(field => {
      const control = this.quoteForm$.get(field);
      return control && control.valid;
    });
  }

  // Helper methods for templates
  hasError(fieldName: string): boolean {
    return !!this.formErrors[fieldName];
  }

  getError(fieldName: string): string {
    return this.formErrors[fieldName] || '';
  }

  // WhatsApp integration
  openWhatsApp(): void {
    const phone = "+27123456789"; // Replace with your actual WhatsApp number
    const message = encodeURIComponent("Hi! I'd like to get a quote for vehicle import/export services.");
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  // Phone call integration
  callUs(): void {
    const phone = "+27123456789"; // Replace with your actual phone number
    window.location.href = `tel:${phone}`;
  }
}
