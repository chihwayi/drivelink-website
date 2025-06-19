import { Component, OnInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { Contact as ContactService } from '../../services/contact';
import { Email as EmailService } from '../../services/email';
import AOS from 'aos';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ImageResize } from '../../directives/image-resize';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


interface ImportExportService {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image: string;
  popular: boolean;
}

interface ImportStep {
  step: number;
  title: string;
  description: string;
  icon: string;
  duration: string;
}

interface TargetCountry {
  name: string;
  code: string;
  flag: string;
  description: string;
  specialties: string[];
  processingTime: string;
  popularity: 'high' | 'medium' | 'low';
}

interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  country: string;
  serviceType: string;
  vehicleType: string;
  budget: string;
  timeframe: string;
  additionalInfo: string;
}

@Component({
  selector: 'app-import-export',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ImageResize],
  templateUrl: './import-export.html',
  styleUrl: './import-export.scss',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('0.6s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('countUp', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('0.8s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class ImportExport implements OnInit, OnDestroy {
  @ViewChild('quoteModal') quoteModal!: ElementRef;

  // Component state
  isLoading = false;
  activeTab = 'import';
  selectedService: ImportExportService | null = null;
  showQuoteModal = false;

  // Form data
  quoteRequest: QuoteRequest = {
    name: '',
    email: '',
    phone: '',
    country: '',
    serviceType: '',
    vehicleType: '',
    budget: '',
    timeframe: '',
    additionalInfo: ''
  };

  // Services data
  importServices: ImportExportService[] = [
    {
      id: 'vehicles',
      title: 'Vehicle Import',
      description: 'Import new and pre-owned vehicles from South Africa to SADC countries and beyond',
      icon: 'bi bi-car-front-fill',
      features: [
        'New & Pre-owned passenger vehicles',
        'Luxury and exotic cars',
        'Commercial vehicles',
        'Full documentation handling',
        'Quality inspection services',
        'Shipping and logistics coordination'
      ],
      image: 'assets/images/services/vehicle-import.jpg',
      popular: true
    },
    {
      id: 'trucks',
      title: 'Trucks & Trailers',
      description: 'Heavy-duty commercial vehicles and trailers for business operations',
      icon: 'bi bi-truck',
      features: [
        'New & Pre-owned trucks',
        'Specialized trailers',
        'Construction vehicles',
        'Mining equipment',
        'Fleet solutions',
        'Financing assistance'
      ],
      image: 'assets/images/services/truck-import.jpg',
      popular: true
    },
    {
      id: 'agriculture',
      title: 'Agricultural Equipment',
      description: 'Farm machinery and agricultural equipment for modern farming',
      icon: 'bi bi-gear-wide-connected',
      features: [
        'Tractors and harvesters',
        'Irrigation systems',
        'Processing equipment',
        'Spare parts availability',
        'Technical support',
        'Training programs'
      ],
      image: 'assets/images/services/agri-import.jpg',
      popular: false
    }
  ];

  exportServices: ImportExportService[] = [
    {
      id: 'vehicle-export',
      title: 'Vehicle Export',
      description: 'Export South African vehicles to international markets',
      icon: 'bi bi-arrow-up-right-circle',
      features: [
        'Right-hand drive specialists',
        'Export documentation',
        'Quality certification',
        'Port logistics',
        'Insurance coverage',
        'Delivery tracking'
      ],
      image: 'assets/images/services/vehicle-export.jpg',
      popular: true
    },
    {
      id: 'business-facilitation',
      title: 'Business Facilitation',
      description: 'Representing international buyers in South African markets',
      icon: 'bi bi-briefcase',
      features: [
        'Supplier representation',
        'Quality inspections',
        'Negotiation support',
        'Documentation handling',
        'Payment facilitation',
        'Market intelligence'
      ],
      image: 'assets/images/services/business-export.jpg',
      popular: true
    }
  ];

  // Import process steps
  importSteps: ImportStep[] = [
    {
      step: 1,
      title: 'Submit Enquiry',
      description: 'Complete our detailed enquiry form with your specific requirements',
      icon: 'bi bi-clipboard-check',
      duration: '5 mins'
    },
    {
      step: 2,
      title: 'Consultation',
      description: 'Our experts contact you to finalize requirements and provide guidance',
      icon: 'bi bi-telephone',
      duration: '24 hours'
    },
    {
      step: 3,
      title: 'Proforma Invoice',
      description: 'Detailed quote issued for your verification and approval',
      icon: 'bi bi-file-earmark-text',
      duration: '48 hours'
    },
    {
      step: 4,
      title: 'Order Confirmation',
      description: 'Final order lodged with payment instructions and vehicle details',
      icon: 'bi bi-check-circle',
      duration: '24 hours'
    },
    {
      step: 5,
      title: 'Processing',
      description: 'Payment confirmation, export documents, and compliance processing',
      icon: 'bi bi-gear',
      duration: '5-10 days'
    },
    {
      step: 6,
      title: 'Delivery',
      description: 'Vehicle ready for delivery or collection with all documentation',
      icon: 'bi bi-truck',
      duration: '2-6 weeks'
    }
  ];

  // Target countries
  targetCountries: TargetCountry[] = [
    {
      name: 'Botswana',
      code: 'BW',
      flag: '🇧🇼',
      description: 'Strong demand for quality vehicles and agricultural equipment',
      specialties: ['Luxury vehicles', 'Mining equipment', 'Agricultural machinery'],
      processingTime: '2-3 weeks',
      popularity: 'high'
    },
    {
      name: 'Namibia',
      code: 'NA',
      flag: '🇳🇦',
      description: 'Growing market for commercial and passenger vehicles',
      specialties: ['Commercial vehicles', 'Tourism fleet', 'Mining trucks'],
      processingTime: '2-4 weeks',
      popularity: 'high'
    },
    {
      name: 'Zambia',
      code: 'ZM',
      flag: '🇿🇲',
      description: 'Increasing demand for reliable transportation solutions',
      specialties: ['Heavy-duty trucks', 'Agricultural equipment', 'Parts supply'],
      processingTime: '3-5 weeks',
      popularity: 'high'
    },
    {
      name: 'Zimbabwe',
      code: 'ZW',
      flag: '🇿🇼',
      description: 'Established market with focus on agricultural and commercial vehicles',
      specialties: ['Agricultural machinery', 'Commercial vehicles', 'Spare parts'],
      processingTime: '2-4 weeks',
      popularity: 'high'
    },
    {
      name: 'Mozambique',
      code: 'MZ',
      flag: '🇲🇿',
      description: 'Emerging market with infrastructure development focus',
      specialties: ['Construction equipment', 'Commercial vehicles', 'Marine engines'],
      processingTime: '3-6 weeks',
      popularity: 'high'
    },
    {
      name: 'Tanzania',
      code: 'TZ',
      flag: '🇹🇿',
      description: 'Growing economy with increasing vehicle demand',
      specialties: ['Public transport', 'Agricultural equipment', 'Mining vehicles'],
      processingTime: '4-6 weeks',
      popularity: 'high'
    },
    /*
    {
      name: 'Kenya',
      code: 'KE',
      flag: '🇰🇪',
      description: 'East African hub with diverse vehicle requirements',
      specialties: ['Passenger vehicles', 'Commercial fleet', 'Agricultural tools'],
      processingTime: '4-7 weeks',
      popularity: 'medium'
    },
    {
      name: 'Democratic Republic of Congo',
      code: 'CD',
      flag: '🇨🇩',
      description: 'Large market with focus on mining and commercial vehicles',
      specialties: ['Mining equipment', 'Heavy trucks', 'Generator sets'],
      processingTime: '5-8 weeks',
      popularity: 'medium'
    }
    */
  ];

  // Statistics
  statistics = [
    { number: '500+', label: 'Vehicles Exported', icon: 'bi bi-car-front' },
    { number: '15+', label: 'Countries Served', icon: 'bi bi-globe' },
    { number: '98%', label: 'Client Satisfaction', icon: 'bi bi-heart' },
    { number: '10+', label: 'Years Experience', icon: 'bi bi-award' }
  ];

  constructor(
    private contactService: ContactService,
    private emailService: EmailService,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
      });
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // Tab switching
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.selectedService = null;
  }

  // Service selection
  selectService(service: ImportExportService): void {
    this.selectedService = service;
    this.quoteRequest.serviceType = service.title;
  }

  // Get current services based on active tab
  getCurrentServices(): ImportExportService[] {
    return this.activeTab === 'import' ? this.importServices : this.exportServices;
  }

  // Modal controls
  openQuoteModal(service?: ImportExportService): void {
    if (service) {
      this.selectedService = service;
      this.quoteRequest.serviceType = service.title;
    }
    this.showQuoteModal = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeQuoteModal(): void {
    this.showQuoteModal = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
    this.resetQuoteForm();
  }

  // Form handling
  resetQuoteForm(): void {
    this.quoteRequest = {
      name: '',
      email: '',
      phone: '',
      country: '',
      serviceType: this.selectedService?.title || '',
      vehicleType: '',
      budget: '',
      timeframe: '',
      additionalInfo: ''
    };
  }

  async submitQuoteRequest(): Promise<void> {
    if (!this.validateQuoteForm()) {
      return;
    }

    this.isLoading = true;

    try {
      const emailData = {
        name: this.quoteRequest.name,
        email: this.quoteRequest.email,
        phone: this.quoteRequest.phone,
        subject: `Import/Export Quote Request - ${this.quoteRequest.serviceType}`,
        message: `
          Service Type: ${this.quoteRequest.serviceType}
          Target Country: ${this.quoteRequest.country}
          Vehicle Type: ${this.quoteRequest.vehicleType}
          Budget Range: ${this.quoteRequest.budget}
          Timeframe: ${this.quoteRequest.timeframe}
          
          Additional Information:
          ${this.quoteRequest.additionalInfo}
        `
      };

      const result = await this.emailService.sendEmail(emailData);

      if (result.success) {
        alert('Quote request submitted successfully! We will contact you within 24 hours.');
        this.closeQuoteModal();
      } else {
        alert('Failed to submit quote request. Please try again or contact us directly.');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  private validateQuoteForm(): boolean {
    const required = ['name', 'email', 'phone', 'country', 'serviceType'];
    const missing = required.filter(field => !this.quoteRequest[field as keyof QuoteRequest]);

    if (missing.length > 0) {
      alert(`Please fill in all required fields: ${missing.join(', ')}`);
      return false;
    }

    if (!this.emailService.validateEmail(this.quoteRequest.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    return true;
  }

  // Country filtering
  getCountriesByPopularity(popularity: 'high' | 'medium' | 'low'): TargetCountry[] {
    return this.targetCountries.filter(country => country.popularity === popularity);
  }

  // External actions
  openWhatsApp(): void {
    if (isPlatformBrowser(this.platformId)) {
      const message = encodeURIComponent(`Hi DriveLink! I'm interested in your import/export services. Please provide more information.`);
      window.open(`https://wa.me/27123456789?text=${message}`, '_blank');
    }
  }

  callUs(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('tel:+27123456789', '_self');
    }
  }

  openGoogleMaps(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://maps.google.com/maps?q=DriveLink+Johannesburg', '_blank');
    }
  }

  // Scroll to section
  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // Utility methods
  getCountryFlag(countryCode: string): string {
    const country = this.targetCountries.find(c => c.code === countryCode);
    return country?.flag || '🌍';
  }

  formatProcessingTime(time: string): string {
    return time.replace('-', ' - ');
  }

  getPopularityBadge(popularity: string): string {
    const badges = {
      high: 'Popular',
      medium: 'Growing',
      low: 'Emerging'
    };
    return badges[popularity as keyof typeof badges] || '';
  }
}
