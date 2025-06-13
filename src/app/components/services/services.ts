import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImageResize } from '../../directives/image-resize'; 

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
  price: string;
  duration: string;
  popular: boolean;
}

@Component({
  selector: 'app-services',
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    RouterModule,
    ImageResize
  ],    
  templateUrl: './services.html',
  styleUrl: './services.scss',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(100px)', opacity: 0 }),
        animate('0.6s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('hoverScale', [
      state('default', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.05)' })),
      transition('default <=> hover', animate('0.3s ease-in-out'))
    ])
  ]
})
export class Services implements OnInit, OnDestroy {
  services: Service[] = [
    {
      id: 'vehicle-export',
      title: 'Vehicle Export Services',
      description: 'Professional vehicle export services to destinations worldwide with full documentation and logistics support.',
      features: [
        'Complete documentation handling',
        'Customs clearance assistance',
        'Insurance coverage',
        'Port-to-port delivery',
        'Real-time tracking',
        'Quality inspection reports'
      ],
      icon: 'bi-truck',
      image: 'assets/images/services/export-service.jpg',
      price: 'From $2,500',
      duration: '14-21 days',
      popular: true
    },
    {
      id: 'vehicle-import',
      title: 'Vehicle Import Services',
      description: 'Seamless vehicle import solutions with comprehensive support from documentation to delivery.',
      features: [
        'Import permit assistance',
        'Duty and tax calculation',
        'Vehicle inspection',
        'Registration support',
        'Delivery to your location',
        'After-sales support'
      ],
      icon: 'bi-box-arrow-in-down',
      image: 'assets/images/services/import-service.jpg',
      price: 'From $1,800',
      duration: '10-14 days',
      popular: false
    },
    {
      id: 'logistics-solutions',
      title: 'Logistics & Transportation',
      description: 'End-to-end logistics solutions including shipping, handling, and secure transportation services.',
      features: [
        'Container shipping',
        'RoRo (Roll-on/Roll-off) services',
        'Secure vehicle handling',
        'GPS tracking',
        'Storage facilities',
        '24/7 support'
      ],
      icon: 'bi-globe',
      image: 'assets/images/services/logistics-service.jpg',
      price: 'From $1,200',
      duration: '7-10 days',
      popular: false
    },
    {
      id: 'documentation',
      title: 'Documentation Services',
      description: 'Complete documentation and paperwork handling for all your vehicle import/export needs.',
      features: [
        'Title verification',
        'Export certificates',
        'Bill of lading',
        'Insurance documents',
        'Customs declarations',
        'Legal compliance'
      ],
      icon: 'bi-file-earmark-text',
      image: 'assets/images/services/documentation-service.jpg',
      price: 'From $500',
      duration: '3-5 days',
      popular: false
    }
  ];

  activeService: Service | null = null;
  isLoading = false;

  constructor() {}

  ngOnInit(): void {
    this.initializeAnimations();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  initializeAnimations(): void {
    // Initialize any additional animations or observers
  }

  selectService(service: Service): void {
    this.activeService = service;
  }

  requestQuote(service: Service): void {
    // Open quote modal or navigate to quote page
    console.log('Requesting quote for:', service.title);
    // You can emit an event to parent component to open quote modal
  }

  openWhatsApp(service: Service): void {
    const message = `Hi! I'm interested in your ${service.title}. Can you provide more information?`;
    const whatsappUrl = `https://wa.me/+27123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  callUs(): void {
    window.open('tel:+27123456789', '_self');
  }

  getServiceImage(imagePath: string): string {
    // Use the image resize service to get optimized image
    return imagePath;
  }

  trackByServiceId(index: number, service: any): any {
    return service.id || index;
  }

  // Add the missing method
  onImageLoaded(src: string): void {
    console.log('Image loaded successfully:', src);
    // You can add any additional logic here when an image is loaded
    // For example, hide loading states, update UI, etc.
  }

  // Optional: Add method to handle image errors
  onImageError(error: string): void {
    console.error('Image loading error:', error);
    // Handle image loading errors
  }

  // Optional: Add method to handle resize complete
  onResizeComplete(result: any): void {
    console.log('Image resize completed:', result);
    // Handle resize completion
  }
}