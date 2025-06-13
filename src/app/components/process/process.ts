import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ImageResize } from '../../directives/image-resize';
import { isPlatformBrowser } from '@angular/common';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
  duration: string;
  features: string[];
  isActive: boolean;
}


@Component({
  selector: 'app-process',
  imports: [CommonModule, ImageResize],
  templateUrl: './process.html',
  styleUrl: './process.scss',
  animations: [
    trigger('slideInUp', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(200, [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('stepAnimation', [
      state('inactive', style({
        transform: 'scale(1)',
        opacity: 0.7
      })),
      state('active', style({
        transform: 'scale(1.05)',
        opacity: 1
      })),
      transition('inactive => active', [
        animate('0.3s ease-in-out')
      ]),
      transition('active => inactive', [
        animate('0.3s ease-in-out')
      ])
    ]),
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class Process implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('processSection', { static: false }) processSectionRef!: ElementRef;

  processSteps: ProcessStep[] = [
    {
      id: 1,
      title: 'Vehicle Selection & Quotation',
      description: 'Browse our extensive inventory or request a specific vehicle. Get detailed quotations including all costs, specifications, and delivery timelines.',
      icon: 'bi-search',
      image: 'assets/images/gallery/process-1.jpg',
      duration: '1-2 Days',
      features: [
        'Comprehensive vehicle inspection',
        'Detailed cost breakdown',
        'Multiple financing options',
        'Custom vehicle sourcing'
      ],
      isActive: true
    },
    {
      id: 2,
      title: 'Documentation & Legal',
      description: 'We handle all paperwork, customs clearance, and legal requirements. Our team ensures compliance with all international trade regulations.',
      icon: 'bi-file-earmark-text',
      image: 'assets/images/services/documentation-service.jpg',
      duration: '3-5 Days',
      features: [
        'Export/Import permits',
        'Insurance documentation',
        'Customs clearance',
        'Legal compliance checks'
      ],
      isActive: false
    },
    {
      id: 3,
      title: 'Logistics & Shipping',
      description: 'Secure packaging and worldwide shipping through our trusted logistics partners. Real-time tracking and updates throughout the journey.',
      icon: 'bi-truck',
      image: 'assets/images/services/logistics-service.jpg',
      duration: '2-6 Weeks',
      features: [
        'Professional packaging',
        'Multiple shipping options',
        'Real-time tracking',
        'Insurance coverage'
      ],
      isActive: false
    },
    {
      id: 4,
      title: 'Delivery & Support',
      description: 'Final delivery to your doorstep with comprehensive after-sales support. We ensure your complete satisfaction with ongoing assistance.',
      icon: 'bi-house-check',
      image: 'assets/images/gallery/showroom.jpg',
      duration: '1-2 Days',
      features: [
        'Doorstep delivery',
        'Quality inspection',
        'After-sales support',
        'Warranty assistance'
      ],
      isActive: false
    }
  ];

  currentStep: number = 1;
  isVisible: boolean = false;
  autoPlayInterval: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  private setupIntersectionObserver(): void {
    // Check if the code is running in a browser environment
    if (isPlatformBrowser(this.platformId) && this.processSectionRef) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.isVisible = true;
                this.animateProgressBar();
                // Optionally, disconnect the observer once it's intersected to save resources
                observer.disconnect();
              }
            });
          },
          { threshold: 0.3 }
        );

        observer.observe(this.processSectionRef.nativeElement);
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        // You might want to implement a simpler animation or just show the element
        console.warn('IntersectionObserver not supported in this browser.');
        // If you still want to animate, you might consider a polyfill or a setTimeout
        // to animate after a short delay if the element is likely in view.
        this.isVisible = true; // Assume visible if no observer
        this.animateProgressBar();
      }
    }
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextStep();
    }, 8000); // Change step every 8 seconds
  }

  selectStep(stepId: number): void {
    this.currentStep = stepId;
    this.updateActiveStep();
    this.resetAutoPlay();
  }

  nextStep(): void {
    this.currentStep = this.currentStep >= this.processSteps.length ? 1 : this.currentStep + 1;
    this.updateActiveStep();
  }

  previousStep(): void {
    this.currentStep = this.currentStep <= 1 ? this.processSteps.length : this.currentStep - 1;
    this.updateActiveStep();
  }

  private updateActiveStep(): void {
    this.processSteps.forEach(step => {
      step.isActive = step.id === this.currentStep;
    });
  }

  private resetAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.startAutoPlay();
    }
  }

  private animateProgressBar(): void {
    // This will be handled by CSS animations
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
      setTimeout(() => {
        (bar as HTMLElement).style.width = '100%';
      }, index * 200);
    });
  }

  getCurrentStep(): ProcessStep {
    return this.processSteps.find(step => step.id === this.currentStep) || this.processSteps[0];
  }

  getStepProgress(): number {
    return (this.currentStep / this.processSteps.length) * 100;
  }

  openQuoteModal(): void {
    // This will trigger the quote modal
    // Implementation depends on your modal service
    console.log('Opening quote modal...');
  }

  contactSupport(): void {
    // This will trigger contact options
    console.log('Opening contact support...');
  }

  onImageLoaded(event: any): void {
    const target = event.target as HTMLImageElement;

    // Add a CSS class to animate the image smoothly after loading
    target.classList.add('image-loaded');

    // Ensure the image is fully visible
    target.style.opacity = '1';
    target.style.transition = 'opacity 0.5s ease-in-out';

    console.log('Image successfully loaded:', target.src);
  }

  // Add this method to handle image errors
  onImageError(event: any): void {
    // Optionally, you can set a fallback image or log the error
    const target = event.target as HTMLImageElement;
    target.src = '../../../../assets/images/fallback-image.png'; // Use your fallback image path
  }

  // Method to handle WhatsApp contact
  openWhatsApp(): void {
    const phoneNumber = '+27123456789'; // Replace with actual number
    const message = 'Hi DriveLink! I would like to know more about your vehicle import/export process.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  // Method to handle phone call
  callUs(): void {
    const phoneNumber = '+27123456789'; // Replace with actual number
    window.location.href = `tel:${phoneNumber}`;
  }
}
