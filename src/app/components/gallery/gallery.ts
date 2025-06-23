import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // Import isPlatformBrowser
import { trigger, style, state, transition, animate, stagger, query } from '@angular/animations';
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
  imports: [CommonModule],
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
    ]),
    trigger('slideTransition', [
    transition('* => *', [
      style({ opacity: 0 }),
      animate('0.8s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 }))
    ])
  ])
  ]
})
export class Gallery implements OnInit, OnDestroy {
  @ViewChild('galleryContainer', { static: true }) galleryContainer!: ElementRef;

  currentSlideIndex: number = 0;
  thumbnailOffset: number = 0;
  autoPlayInterval: any;
  autoPlayEnabled: boolean = true;
  autoPlayDelay: number = 5000; // 5 seconds

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
      tags: ['Ford', 'truck', 'Premium', 'Import']
    },
    {
      id: 5,
      title: 'Ford Ranger Delivery',
      description: 'Powerful pickup truck for agricultural operations',
      imagePath: 'assets/images/gallery/delivery-5.jpeg',
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
      imagePath: 'assets/images/gallery/delivery-6.jpeg',
      category: 'sedan',
      clientName: 'Mr. Patel',
      deliveryDate: '2024-02-10',
      location: 'Port Elizabeth',
      tags: ['Honda', 'Sedan', 'Efficient', 'Daily']
    }
    ,
    {
      id: 7,
      title: 'Mixed Machinery Delivery',
      description: 'Heavy machinery delivered to a farming client',
      imagePath: 'assets/images/gallery/delivery-7.jpeg',
      category: 'truck',
      clientName: 'Mr P Zulu',
      deliveryDate: '2025-01-07',
      location: 'Messina',
      tags: ['Tractor', 'Combine Harvestor', 'Power', 'Farming']
    }
    ,
    {
      id: 8,
      title: 'Toyota Hilux',
      description: 'Reliable pickup truck ready for business operations',
      imagePath: 'assets/images/gallery/delivery-8.jpeg',
      category: 'truck',
      clientName: 'Dr. Howeritz',
      deliveryDate: '2024-12-23',
      location: 'Cape Town',
      tags: ['Toyota', 'Pickup', 'Commercial', 'Reliable']
    }
    ,
    {
      id: 9,
      title: 'Toyota Hilux',
      description: 'Reliable pickup truck ready for business operations',
      imagePath: 'assets/images/gallery/delivery-9.jpeg',
      category: 'truck',
      clientName: 'Mrs Mwanza',
      deliveryDate: '2025-03-13',
      location: 'Lusaka, Zambia',
      tags: ['Toyota', 'Pickup', 'Commercial', 'Reliable']
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
    { key: 'truck', label: 'Trucks and Machinery', icon: 'bi-truck-front' },
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

    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.intersectionObserver) { // Add platform check here too
      this.intersectionObserver.disconnect();
    }
    this.stopAutoPlay();
  }

  nextSlide(): void {
    if (this.filteredItems.length <= 1) return;
    
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.filteredItems.length;
    this.updateThumbnailPosition();
    this.resetAutoPlay();
  }
  
  previousSlide(): void {
    if (this.filteredItems.length <= 1) return;
    
    this.currentSlideIndex = this.currentSlideIndex === 0 
      ? this.filteredItems.length - 1 
      : this.currentSlideIndex - 1;
    this.updateThumbnailPosition();
    this.resetAutoPlay();
  }
  
  goToSlide(index: number): void {
    if (index >= 0 && index < this.filteredItems.length) {
      this.currentSlideIndex = index;
      this.updateThumbnailPosition();
      this.resetAutoPlay();
    }
  }
  
  scrollThumbnails(direction: 'prev' | 'next'): void {
    const thumbnailWidth = 120; // 100px width + 20px gap
    const containerWidth = 600; // Approximate visible width
    const maxOffset = -(this.filteredItems.length * thumbnailWidth - containerWidth);
    
    if (direction === 'prev') {
      this.thumbnailOffset = Math.min(this.thumbnailOffset + thumbnailWidth * 3, 0);
    } else {
      this.thumbnailOffset = Math.max(this.thumbnailOffset - thumbnailWidth * 3, maxOffset);
    }
  }
  
  private updateThumbnailPosition(): void {
    const thumbnailWidth = 120;
    const containerWidth = 600;
    const currentPosition = this.currentSlideIndex * thumbnailWidth;
    const maxOffset = -(this.filteredItems.length * thumbnailWidth - containerWidth);
    
    // Center the current thumbnail in view
    const targetOffset = -(currentPosition - containerWidth / 2 + thumbnailWidth / 2);
    this.thumbnailOffset = Math.max(Math.min(targetOffset, 0), maxOffset);
  }
  
  startAutoPlay(): void {
    if (!this.autoPlayEnabled || this.filteredItems.length <= 1) return;
    
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }
  
  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  resetAutoPlay(): void {
    this.stopAutoPlay();
    if (this.autoPlayEnabled) {
      setTimeout(() => {
        this.startAutoPlay();
      }, 1000); // Resume after 1 second
    }
  }
  
  toggleAutoPlay(): void {
    this.autoPlayEnabled = !this.autoPlayEnabled;
    if (this.autoPlayEnabled) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }
  
  // Keyboard navigation
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.isModalOpen) {
      if (event && event.key) {
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
    } else {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          this.previousSlide();
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.nextSlide();
          break;
        case ' ': // Spacebar to toggle auto-play
          event.preventDefault();
          this.toggleAutoPlay();
          break;
        case 'Escape':
          if (this.isModalOpen) {
            this.closeModal();
          }
          break;
      }
    }
  }
  
  // Update filter method to reset slide index
  filterGallery(category: string): void {
    // Your existing filter logic...
    this.activeFilter = category;
    
    if (category === 'all') {
      this.filteredItems = [...this.galleryItems];
    } else {
      this.filteredItems = this.galleryItems.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Reset slide index when filtering
    this.currentSlideIndex = 0;
    this.thumbnailOffset = 0;
    this.resetAutoPlay();
  }
  
  // Touch/swipe support for mobile
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }
  
  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }
  
  private handleSwipe(): void {
    const swipeThreshold = 50;
    const swipeDistance = this.touchStartX - this.touchEndX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swiped left - next slide
        this.nextSlide();
      } else {
        // Swiped right - previous slide
        this.previousSlide();
      }
    }
  }

  onImageError(event: any, item: GalleryItem): void {
  console.error(`Failed to load image: ${item.imagePath}`, event);
  // Fallback to a placeholder image
  event.target.src = 'assets/images/gallery/placeholder.jpg';
  
  // Or you could try different path variations:
  if (!event.target.src.includes('/drivelink-website/')) {
    event.target.src = `/drivelink-website/${item.imagePath}`;
  }
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
    const whatsappUrl = `https://wa.me/+27123456789?text=${encodeURIComponent(message)}`;
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
      case 'luxury':
        return 'bi-gem';
      case 'sedan':
        return 'bi-car-front';
      case 'suv':
        return 'bi-truck';
      case 'truck':
        return 'bi-truck-front';
      case 'commercial':
        return 'bi-building';
      default:
        return 'bi-grid';
    }
  }

  getImagePath(path: string): string {
    // Check if we're on GitHub Pages
    if (isPlatformBrowser(this.platformId)) {
      const isGitHubPages = window.location.hostname === 'chihwayi.github.io';
      if (isGitHubPages) {
        // Remove leading './' if present and add base href
        const cleanPath = path.replace(/^\.\//, '');
        return `/drivelink-website/${cleanPath}`;
      }
    }
    return path;
  }
}