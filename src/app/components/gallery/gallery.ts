import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // Import isPlatformBrowser
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';
import { ImageResize } from '../../directives/image-resize';
import { ImageResizeOptions } from '../../services/image-resize';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  category: 'luxury' | 'sedan' | 'suv' | 'truck' | 'commercial';
  clientName: string;
  deliveryDate: string;
  location: string;
  tags: string[];
}

@Component({
  selector: 'app-gallery',
  imports: [CommonModule, ImageResize],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(100px)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('zoomIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('filterAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'scale(0.8)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class Gallery implements OnInit, OnDestroy {
  @ViewChild('galleryContainer', { static: true }) galleryContainer!: ElementRef;

   // Image resize options
    imageResizeOptions: ImageResizeOptions = {
      maxWidth: 800,
      maxHeight: 600,
      quality: 0.9,
      format: 'webp'
    };

  // Gallery data
  galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: 'Toyota Fortuner Delivery',
      description: 'Premium SUV delivered to satisfied client in Zimbabwe from South Africa',
      imagePath: 'assets/images/gallery/delivery-1.jpeg',
      category: 'luxury',
      clientName: 'Mrs. Zulu',
      deliveryDate: '2024-01-15',
      location: 'Bulawayo',
      tags: ['BMW', 'SUV', 'Luxury', 'Import']
    },
    {
      id: 2,
      title: 'Mercedes G Wagon Handover',
      description: 'Elegant sedan successfully imported and delivered',
      imagePath: 'assets/images/gallery/delivery-2.jpeg',
      category: 'sedan',
      clientName: 'Mr. Smith',
      deliveryDate: '2024-01-20',
      location: 'Cape Town',
      tags: ['Mercedes', 'Sedan', 'German', 'Export']
    },
    {
      id: 3,
      title: 'Toyota Hilux',
      description: 'Reliable pickup truck ready for business operations',
      imagePath: 'assets/images/gallery/delivery-3.jpeg',
      category: 'truck',
      clientName: 'Mrs. Nkosi',
      deliveryDate: '2024-01-25',
      location: 'Durban',
      tags: ['Toyota', 'Pickup', 'Commercial', 'Reliable']
    },
    {
      id: 4,
      title: 'Ford Raptor Delivery',
      description: 'Luxury truck with full documentation and premium service',
      imagePath: 'assets/images/gallery/delivery-4.jpeg',
      category: 'truck',
      clientName: 'Dr. Williams',
      deliveryDate: '2024-02-01',
      location: 'Pretoria',
      tags: ['Audi', 'SUV', 'Premium', 'Import']
    },
    {
      id: 5,
      title: 'Ford Ranger Delivery',
      description: 'Powerful pickup truck for agricultural operations',
      imagePath: 'assets/images/gallery/delivery-5.png',
      category: 'truck',
      clientName: 'Green Valley Farms',
      deliveryDate: '2024-02-05',
      location: 'Mpumalanga',
      tags: ['Ford', 'Pickup', 'Agriculture', 'Powerful']
    },
    {
      id: 6,
      title: 'Honda Civic Handover',
      description: 'Fuel-efficient sedan for daily commuting',
      imagePath: 'assets/images/gallery/delivery-6.png',
      category: 'sedan',
      clientName: 'Mr. Patel',
      deliveryDate: '2024-02-10',
      location: 'Port Elizabeth',
      tags: ['Honda', 'Sedan', 'Efficient', 'Daily']
    }
  ];

  // Filter and display properties
  activeFilter: string = 'all';
  filteredItems: GalleryItem[] = [];
  selectedItem: GalleryItem | null = null;
  isModalOpen: boolean = false;
  currentImageIndex: number = 0;

  // Categories for filtering
  categories = [
    { key: 'all', label: 'All Deliveries', icon: 'bi-grid' },
    { key: 'luxury', label: 'Luxury', icon: 'bi-gem' },
    { key: 'sedan', label: 'Sedans', icon: 'bi-car-front' },
    { key: 'suv', label: 'SUVs', icon: 'bi-truck' },
    { key: 'truck', label: 'Trucks', icon: 'bi-truck-front' },
    { key: 'commercial', label: 'Commercial', icon: 'bi-building' }
  ];

  // Animation and interaction states
  isLoading: boolean = false;
  intersectionObserver!: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {} // Inject PLATFORM_ID

  ngOnInit(): void {
    this.filteredItems = [...this.galleryItems];
    // Only initialize IntersectionObserver and add scroll animations in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.initializeIntersectionObserver();
      this.addScrollAnimations();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.intersectionObserver) { // Add platform check here too
      this.intersectionObserver.disconnect();
    }
  }

  // Filter methods
  filterGallery(category: string): void {
    this.activeFilter = category;
    this.isLoading = true;

    setTimeout(() => {
      if (category === 'all') {
        this.filteredItems = [...this.galleryItems];
      } else {
        this.filteredItems = this.galleryItems.filter(item => item.category === category);
      }
      this.isLoading = false;
    }, 300);
  }

  // Modal methods
  openModal(item: GalleryItem): void {
    this.selectedItem = item;
    this.currentImageIndex = this.galleryItems.findIndex(i => i.id === item.id);
    this.isModalOpen = true;
    if (isPlatformBrowser(this.platformId)) { // Add platform check for document.body.style
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
    if (isPlatformBrowser(this.platformId)) { // Add platform check for document.body.style
      document.body.style.overflow = 'auto';
    }
  }

  // Navigation methods
  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryItems.length;
    this.selectedItem = this.galleryItems[this.currentImageIndex];
  }

  prevImage(): void {
    this.currentImageIndex = this.currentImageIndex === 0
      ? this.galleryItems.length - 1
      : this.currentImageIndex - 1;
    this.selectedItem = this.galleryItems[this.currentImageIndex];
  }

  // Utility methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Social sharing methods
  shareOnWhatsApp(item: GalleryItem): void {
    const message = `Check out this amazing ${item.title} delivery by DriveLink! 🚗✨`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    if (isPlatformBrowser(this.platformId)) { // Add platform check for window.open
      window.open(url, '_blank');
    }
  }

  shareOnFacebook(item: GalleryItem): void {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    if (isPlatformBrowser(this.platformId)) { // Add platform check for window.open
      window.open(url, '_blank', 'width=600,height=400');
    }
  }

  // Contact methods
  contactForSimilar(item: GalleryItem | null) {
    const message = `Hi DriveLink! I'm interested in a vehicle similar to the ${item?.title}. Can you help me find one?`;
    const whatsappUrl = `https://wa.me/27123456789?text=${encodeURIComponent(message)}`;
    if (isPlatformBrowser(this.platformId)) { // Add platform check for window.open
      window.open(whatsappUrl, '_blank');
    }
  }

  // Animation setup
  private initializeIntersectionObserver(): void {
    // Ensure IntersectionObserver is defined before using it
    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
            }
          });
        },
        { threshold: 0.1 }
      );

      // Observe all gallery items
      setTimeout(() => {
        // Ensure galleryContainer is available and in browser environment
        if (this.galleryContainer && this.galleryContainer.nativeElement) {
          const items = this.galleryContainer.nativeElement.querySelectorAll('.gallery-item');
          items.forEach((item: Element) => {
            this.intersectionObserver.observe(item);
          });
        }
      }, 100);
    }
  }

  private addScrollAnimations(): void {
    // Add AOS attributes to elements
    // Ensure document is available
    if (typeof document !== 'undefined') {
      const elements = document.querySelectorAll('.gallery-item');
      elements.forEach((el, index) => {
        el.setAttribute('data-aos', 'fade-up');
        el.setAttribute('data-aos-delay', (index * 100).toString());
      });
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'suv':
        return 'bi bi-truck';
      case 'sedan':
        return 'bi bi-car-front';
      case 'motorcycle':
        return 'bi bi-bicycle';
      case 'truck':
        return 'bi bi-truck-front';
      case 'van':
        return 'bi bi-truck';
      default:
        return 'bi bi-car-front';
    }
  }

  // Keyboard navigation
  onKeydown(event: KeyboardEvent): void {
    if (this.isModalOpen) {
      switch (event.key) {
        case 'Escape':
          this.closeModal();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
        case 'ArrowLeft':
          this.prevImage();
          break;
      }
    }
  }
}