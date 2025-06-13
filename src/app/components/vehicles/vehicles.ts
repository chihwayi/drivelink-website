import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core'; // Import Inject and PLATFORM_ID
import { isPlatformBrowser, CommonModule } from '@angular/common'; // Import isPlatformBrowser
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';
import { Swiper } from 'swiper';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { ImageResize } from '../../directives/image-resize';
import { ImageResizeOptions } from '../../services/image-resize';
import { FormsModule } from '@angular/forms';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  images: string[];
  year: number;
  make: string;
  model: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  condition: string;
  location: string;
  description: string;
  features: string[];
  specifications: {
    engine: string;
    power: string;
    torque: string;
    topSpeed: string;
    acceleration: string;
    fuelConsumption: string;
  };
  availability: 'available' | 'sold' | 'reserved';
  isNew: boolean;
  isFeatured: boolean;
  rating: number;
  reviews: number;
}

interface VehicleCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
  count: number;
  active: boolean;
}

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, ImageResize, FormsModule],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.scss',
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
          stagger(200, [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardHover', [
      state('default', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.05)' })),
      transition('default <=> hovered', animate('0.3s ease-in-out'))
    ])
  ]
})
export class Vehicles implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('vehicleSwiper', { static: false }) vehicleSwiperRef!: ElementRef;
  @ViewChild('categorySwiper', { static: false }) categorySwiperRef!: ElementRef;

  // Component state
  selectedCategory: string = 'all';
  selectedVehicle: Vehicle | null = null;
  isLoading: boolean = true;
  currentView: 'grid' | 'list' = 'grid';
  sortBy: 'price' | 'year' | 'name' | 'mileage' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  searchQuery: string = '';
  priceRange: { min: number; max: number } = { min: 0, max: 1000000 };
  currentPriceRange: { min: number; max: number } = { min: 0, max: 1000000 };

  // Swiper instances
  private mainSwiper?: Swiper;
  private categorySwiperInstance?: Swiper;

  // Image resize options
  imageResizeOptions: ImageResizeOptions = {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.9,
    format: 'webp'
  };

  // Vehicle categories
  vehicleCategories: VehicleCategory[] = [
    {
      id: 'all',
      name: 'All Vehicles',
      icon: 'bi-grid-3x3-gap',
      description: 'Browse all available vehicles',
      image: 'assets/images/vehicles/all-vehicles.jpg',
      count: 0,
      active: true
    },
    {
      id: 'sedan',
      name: 'Sedans',
      icon: 'bi-car-front',
      description: 'Comfortable and efficient',
      image: 'assets/images/vehicles/sedans/category-sedan.jpg',
      count: 0,
      active: false
    },
    {
      id: 'suv',
      name: 'SUVs',
      icon: 'bi-truck',
      description: 'Spacious and versatile',
      image: 'assets/images/vehicles/suvs/category-suv.jpg',
      count: 0,
      active: false
    },
    {
      id: 'luxury',
      name: 'Luxury',
      icon: 'bi-gem',
      description: 'Premium and sophisticated',
      image: 'assets/images/vehicles/luxury/category-luxury.jpg',
      count: 0,
      active: false
    },
    {
      id: 'truck',
      name: 'Trucks',
      icon: 'bi-truck-flatbed',
      description: 'Powerful and robust',
      image: 'assets/images/vehicles/trucks/category-truck.jpg',
      count: 0,
      active: false
    },
    {
      id: 'commercial',
      name: 'Commercial',
      icon: 'bi-building',
      description: 'Business solutions',
      image: 'assets/images/vehicles/commercial/category-commercial.jpg',
      count: 0,
      active: false
    }
  ];

  // Sample vehicles data
  vehicles: Vehicle[] = [
    {
      id: '1',
      name: 'BMW 3 Series',
      category: 'sedan',
      price: '$45,000',
      image: 'assets/images/vehicles/sedans/bmw-3-series-1.jpg',
      images: [
        'assets/images/vehicles/sedans/bmw-3-series-1.jpg',
        'assets/images/vehicles/sedans/bmw-3-series-2.jpg',
        'assets/images/vehicles/sedans/bmw-3-series-3.jpg',
        'assets/images/vehicles/sedans/bmw-3-series-4.jpg'
      ],
      year: 2023,
      make: 'BMW',
      model: '3 Series 330i',
      mileage: '15,000 km',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      condition: 'Excellent',
      location: 'Johannesburg, SA',
      description: 'Luxurious sedan with premium features and exceptional performance.',
      features: ['Leather Seats', 'Navigation System', 'Sunroof', 'Bluetooth', 'Cruise Control'],
      specifications: {
        engine: '2.0L Turbo 4-Cylinder',
        power: '255 hp',
        torque: '400 Nm',
        topSpeed: '250 km/h',
        acceleration: '0-100 km/h in 5.8s',
        fuelConsumption: '7.1L/100km'
      },
      availability: 'available',
      isNew: false,
      isFeatured: true,
      rating: 4.8,
      reviews: 24
    },
    {
      id: '2',
      name: 'Toyota Land Cruiser',
      category: 'suv',
      price: '$75,000',
      image: 'assets/images/vehicles/suvs/toyota-landcruiser-1.jpg',
      images: [
        'assets/images/vehicles/suvs/toyota-landcruiser-1.jpg',
        'assets/images/vehicles/suvs/toyota-landcruiser-2.jpg',
        'assets/images/vehicles/suvs/toyota-landcruiser-3.jpg',
        'assets/images/vehicles/suvs/toyota-landcruiser-4.jpg'
      ],
      year: 2024,
      make: 'Toyota',
      model: 'Land Cruiser VX',
      mileage: '5,000 km',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      condition: 'Excellent',
      location: 'Cape Town, SA',
      description: 'Legendary off-road capability with modern luxury features.',
      features: ['4WD', '7 Seats', 'Leather Interior', 'Premium Sound', 'Safety Package'],
      specifications: {
        engine: '3.3L V6 Twin-Turbo Diesel',
        power: '309 hp',
        torque: '700 Nm',
        topSpeed: '210 km/h',
        acceleration: '0-100 km/h in 6.7s',
        fuelConsumption: '8.9L/100km'
      },
      availability: 'available',
      isNew: true,
      isFeatured: true,
      rating: 4.9,
      reviews: 18
    },
    {
      id: '3',
      name: 'Mercedes-Benz S-Class',
      category: 'luxury',
      price: '$120,000',
      image: 'assets/images/vehicles/luxury/mercedes-s-class-1.jpg',
      images: [
        'assets/images/vehicles/luxury/mercedes-s-class-1.jpg',
        'assets/images/vehicles/luxury/mercedes-s-class-2.jpg',
        'assets/images/vehicles/luxury/mercedes-s-class-3.jpg',
        'assets/images/vehicles/luxury/mercedes-s-class-4.jpg',
        'assets/images/vehicles/luxury/mercedes-s-class-5.jpg',
        'assets/images/vehicles/luxury/mercedes-s-class-6.jpg'
      ],
      year: 2024,
      make: 'Mercedes-Benz',
      model: 'S 450 4MATIC',
      mileage: '2,000 km',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      condition: 'Brand New',
      location: 'Pretoria, SA',
      description: 'The pinnacle of luxury and technology in automotive excellence.',
      features: ['Massage Seats', 'Ambient Lighting', 'Premium Audio', 'Driver Assistance', 'Panoramic Roof'],
      specifications: {
        engine: '3.0L V6 Turbo',
        power: '367 hp',
        torque: '500 Nm',
        topSpeed: '250 km/h',
        acceleration: '0-100 km/h in 5.4s',
        fuelConsumption: '8.4L/100km'
      },
      availability: 'available',
      isNew: true,
      isFeatured: true,
      rating: 5.0,
      reviews: 12
    },
    {
      id: '4',
      name: 'Ford Ranger Raptor',
      category: 'truck',
      price: '$65,000',
      image: 'assets/images/vehicles/trucks/ford-ranger-raptor-1.jpg',
      images: [
        'assets/images/vehicles/trucks/ford-ranger-raptor-1.jpg',
        'assets/images/vehicles/trucks/ford-ranger-raptor-2.jpg',
        'assets/images/vehicles/trucks/ford-ranger-raptor-3.jpg',
        'assets/images/vehicles/trucks/ford-ranger-raptor-4.jpg',
        'assets/images/vehicles/trucks/ford-ranger-raptor-5.jpg',
        'assets/images/vehicles/trucks/ford-ranger-raptor-6.jpg',
        'assets/images/vehicles/trucks/ford-ranger-raptor-7.jpg'
      ],
      year: 2023,
      make: 'Ford',
      model: 'Ranger Raptor',
      mileage: '8,000 km',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      condition: 'Excellent',
      location: 'Durban, SA',
      description: 'Performance truck built for adventure and tough terrain.',
      features: ['4WD', 'Off-Road Package', 'Sport Seats', 'Navigation', 'Tow Package'],
      specifications: {
        engine: '2.0L Bi-Turbo Diesel',
        power: '213 hp',
        torque: '500 Nm',
        topSpeed: '170 km/h',
        acceleration: '0-100 km/h in 10.5s',
        fuelConsumption: '9.8L/100km'
      },
      availability: 'available',
      isNew: false,
      isFeatured: false,
      rating: 4.6,
      reviews: 31
    },
    {
      id: '5',
      name: 'Mercedes Sprinter',
      category: 'commercial',
      price: '$55,000',
      image: 'assets/images/vehicles/commercial/mercedes-sprinter-1.jpg',
      images: [
        'assets/images/vehicles/commercial/mercedes-sprinter-1.jpg',
        'assets/images/vehicles/commercial/mercedes-sprinter-2.jpg',
        'assets/images/vehicles/commercial/mercedes-sprinter-3.jpg'
      ],
      year: 2023,
      make: 'Mercedes-Benz',
      model: 'Sprinter 316 CDI',
      mileage: '12,000 km',
      fuelType: 'Diesel',
      transmission: 'Manual',
      condition: 'Good',
      location: 'Johannesburg, SA',
      description: 'Reliable commercial van perfect for business transportation needs.',
      features: ['Large Cargo Space', 'Bluetooth', 'Air Conditioning', 'Power Steering', 'ABS'],
      specifications: {
        engine: '2.1L 4-Cylinder Diesel',
        power: '163 hp',
        torque: '360 Nm',
        topSpeed: '160 km/h',
        acceleration: '0-100 km/h in 11.2s',
        fuelConsumption: '7.8L/100km'
      },
      availability: 'available',
      isNew: false,
      isFeatured: false,
      rating: 4.3,
      reviews: 8
    },
    {
      id: '6',
      name: 'Honda Civic',
      category: 'sedan',
      price: '$35,000',
      image: 'assets/images/vehicles/sedans/honda-civic-1.jpg',
      images: [
        'assets/images/vehicles/sedans/honda-civic-1.jpg',
        'assets/images/vehicles/sedans/honda-civic-2.jpg',
        'assets/images/vehicles/sedans/honda-civic-3.jpg',
        'assets/images/vehicles/sedans/honda-civic-4.jpg',
        'assets/images/vehicles/sedans/honda-civic-5.jpg'
      ],
      year: 2023,
      make: 'Honda',
      model: 'Civic Type R',
      mileage: '6,000 km',
      fuelType: 'Petrol',
      transmission: 'Manual',
      condition: 'Excellent',
      location: 'Cape Town, SA',
      description: 'Sport sedan with excellent performance and reliability.',
      features: ['Sport Seats', 'Turbo Engine', 'Manual Transmission', 'Sport Suspension', 'Premium Audio'],
      specifications: {
        engine: '2.0L Turbo 4-Cylinder',
        power: '320 hp',
        torque: '400 Nm',
        topSpeed: '270 km/h',
        acceleration: '0-100 km/h in 5.7s',
        fuelConsumption: '8.2L/100km'
      },
      availability: 'sold',
      isNew: false,
      isFeatured: true,
      rating: 4.7,
      reviews: 19
    }
  ];

  filteredVehicles: Vehicle[] = [];
  featuredVehicles: Vehicle[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { } // Inject PLATFORM_ID

  ngOnInit(): void {
    this.initializeComponent();
    this.calculateCategoryCounts();
    this.filterVehicles();
    this.getFeaturedVehicles();

    // Simulate loading
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Add a small delay to ensure DOM is fully rendered
      setTimeout(() => {
        this.initializeSwipers();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.mainSwiper) {
      this.mainSwiper.destroy();
    }
    if (this.categorySwiperInstance) {
      this.categorySwiperInstance.destroy();
    }
  }

  private initializeComponent(): void {
    // Initialize AOS if available
    if (isPlatformBrowser(this.platformId) && (window as any).AOS) { // Also check for browser for AOS
      (window as any).AOS.init({
        duration: 600,
        once: true,
        offset: 100
      });
    }
  }

  private initializeSwipers(): void {
    console.log('Initializing swipers...');

    // Initialize main vehicle swiper
    if (this.vehicleSwiperRef?.nativeElement) {
      console.log('Initializing main swiper');
      this.mainSwiper = new Swiper(this.vehicleSwiperRef.nativeElement, {
        modules: [Navigation, Pagination, Autoplay, EffectCoverflow],
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        },
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
    }

    // Initialize category swiper - FIXED
    if (this.categorySwiperRef?.nativeElement) {
      console.log('Initializing category swiper');
      console.log('Category swiper element:', this.categorySwiperRef.nativeElement);

      this.categorySwiperInstance = new Swiper(this.categorySwiperRef.nativeElement, {
        modules: [Navigation], // Only Navigation module needed
        slidesPerView: 1, // Start with 1 slide for mobile
        spaceBetween: 20,
        grabCursor: true, // Enable grab cursor
        watchSlidesProgress: true, // Watch slide progress
        navigation: {
          nextEl: '.category-swiper-button-next',
          prevEl: '.category-swiper-button-prev',
        },
        breakpoints: {
          576: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          992: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 5,
          },
          1400: {
            slidesPerView: 6,
          },
        },
        // Enable touch/mouse drag
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        // Disable freeMode for better control
        freeMode: false,
        // Add resistance when reaching boundaries
        resistance: true,
        resistanceRatio: 0.85,
      });

      // Log swiper initialization
      console.log('Category swiper initialized:', this.categorySwiperInstance);

      // Force update swiper after initialization
      setTimeout(() => {
        if (this.categorySwiperInstance) {
          this.categorySwiperInstance.update();
          console.log('Category swiper updated');
        }
      }, 200);
    } else {
      console.error('Category swiper element not found');
    }
  }

  private calculateCategoryCounts(): void {
    this.vehicleCategories.forEach(category => {
      if (category.id === 'all') {
        category.count = this.vehicles.length;
      } else {
        category.count = this.vehicles.filter(vehicle => vehicle.category === category.id).length;
      }
    });
  }

  private filterVehicles(): void {
    let filtered = this.vehicles;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.description.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(vehicle => {
      const price = parseInt(vehicle.price.replace(/[^0-9]/g, ''));
      return price >= this.currentPriceRange.min && price <= this.currentPriceRange.max;
    });

    // Sort vehicles
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'price':
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          comparison = priceA - priceB;
          break;
        case 'year':
          comparison = a.year - b.year;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'mileage':
          const mileageA = parseInt(a.mileage.replace(/[^0-9]/g, ''));
          const mileageB = parseInt(b.mileage.replace(/[^0-9]/g, ''));
          comparison = mileageA - mileageB;
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredVehicles = filtered;
  }

  private getFeaturedVehicles(): void {
    this.featuredVehicles = this.vehicles.filter(vehicle => vehicle.isFeatured);
  }

  // Public methods
  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.vehicleCategories.forEach(cat => cat.active = cat.id === categoryId);
    this.filterVehicles();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.filterVehicles();
  }

  onSortChange(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy as any;
      this.sortOrder = 'asc';
    }
    this.filterVehicles();
  }

  onPriceRangeChange(range: { min: number; max: number }): void {
    this.currentPriceRange = range;
    this.filterVehicles();
  }

  toggleView(): void {
    this.currentView = this.currentView === 'grid' ? 'list' : 'grid';
  }

  openVehicleDetails(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    // This would open a modal - you'll implement this when creating the modal component
    console.log('Opening vehicle details for:', vehicle.name);
  }

  requestQuote(vehicle: Vehicle): void {
    // This would open a quote modal
    console.log('Requesting quote for:', vehicle.name);
  }

  contactDealer(vehicle: Vehicle): void {
    // This would open contact modal or redirect to contact
    console.log('Contacting dealer about:', vehicle.name);
  }

  shareVehicle(vehicle: Vehicle): void {
    if (isPlatformBrowser(this.platformId) && navigator.share) { // Conditionally check for browser
      navigator.share({
        title: vehicle.name,
        text: vehicle.description,
        url: window.location.href
      });
    } else if (isPlatformBrowser(this.platformId)) { // Fallback only in browser
      // Fallback for browsers that don't support Web Share API
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        console.log('URL copied to clipboard');
      });
    }
  }

  addToWishlist(vehicle: Vehicle): void {
    // Implementation for wishlist functionality
    console.log('Added to wishlist:', vehicle.name);
  }

  compareVehicles(vehicle: Vehicle): void {
    // Implementation for vehicle comparison
    console.log('Compare vehicle:', vehicle.name);
  }

  trackByVehicleId(index: number, vehicle: any): any {
    return vehicle.id;
  }

  trackByCategoryId(index: number, category: VehicleCategory): string {
    return category.id;
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  formatPrice(price: string): string {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  getAvailabilityClass(availability: string): string {
    switch (availability) {
      case 'available': return 'status-available';
      case 'sold': return 'status-sold';
      case 'reserved': return 'status-reserved';
      default: return '';
    }
  }

  getAvailabilityText(availability: string): string {
    switch (availability) {
      case 'available': return 'Available';
      case 'sold': return 'Sold';
      case 'reserved': return 'Reserved';
      default: return '';
    }
  }
}