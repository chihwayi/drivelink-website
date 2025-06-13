import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, PLATFORM_ID, Inject, enableProdMode } from '@angular/core';
import { Swiper } from 'swiper';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { ImageResize } from '../../directives/image-resize';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  rating: number;
  content: string;
  image: string;
  date: string;
  service: string;
  location: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true, // Mark as standalone
  imports: [CommonModule, ImageResize],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss'
})
export class Testimonials implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('testimonialsSwiper', { static: false }) testimonialsSwiper!: ElementRef;

  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'John Mitchell',
      position: 'Business Owner',
      company: 'Mitchell Enterprises',
      rating: 5,
      content: 'DriveLink made importing my fleet of vehicles seamless and stress-free. Their attention to detail and professional service exceeded all my expectations. The entire process was transparent and efficient.',
      image: 'assets/images/testimonials/client-1.jpg',
      date: '2024-01-15',
      service: 'Vehicle Import',
      location: 'Cape Town, South Africa'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'Logistics Manager',
      company: 'Global Trade Co.',
      rating: 5,
      content: 'Outstanding service from start to finish! DriveLink handled all the complex documentation and shipping arrangements perfectly. I would definitely recommend them to anyone looking for reliable vehicle import/export services.',
      image: 'assets/images/testimonials/client-2.jpg',
      date: '2024-02-08',
      service: 'Export Services',
      location: 'Johannesburg, South Africa'
    },
    {
      id: 3,
      name: 'Michael Chen',
      position: 'Car Dealer',
      company: 'Premium Motors',
      rating: 5,
      content: 'The team at DriveLink is incredibly knowledgeable and professional. They guided us through every step of the import process and delivered exactly what they promised. Exceptional value for money!',
      image: 'assets/images/testimonials/client-3.jpg',
      date: '2024-01-28',
      service: 'Luxury Vehicle Import',
      location: 'Durban, South Africa'
    },
    {
      id: 4,
      name: 'Emma Thompson',
      position: 'Fleet Manager',
      company: 'Thompson Logistics',
      rating: 5,
      content: 'DriveLink\'s expertise in handling commercial vehicle imports is unmatched. They saved us significant time and money while ensuring all compliance requirements were met perfectly.',
      image: 'assets/images/testimonials/client-4.jpg',
      date: '2024-02-12',
      service: 'Commercial Fleet Import',
      location: 'Port Elizabeth, South Africa'
    },
    {
      id: 5,
      name: 'David Rodriguez',
      position: 'Entrepreneur',
      company: 'Rodriguez Auto',
      rating: 5,
      content: 'From initial consultation to final delivery, DriveLink provided exceptional service. Their team went above and beyond to ensure our luxury vehicles arrived in perfect condition.',
      image: 'assets/images/testimonials/client-5.jpg',
      date: '2024-01-20',
      service: 'Luxury Car Import',
      location: 'Pretoria, South Africa'
    }
  ];

  private swiper?: Swiper;
  private animationFrameId?: number;
  private isBrowser: boolean; // Add a property to store the platform check

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startFloatingAnimation();
    }
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  ngAfterViewInit(): void {
    // Only initialize Swiper if in a browser environment
    if (this.isBrowser) {
      this.initializeSwiper();
    }
  }

  private initializeSwiper(): void {
    // Ensure testimonialsSwiper is defined before attempting to access nativeElement
    if (this.testimonialsSwiper && this.testimonialsSwiper.nativeElement) {
      this.swiper = new Swiper(this.testimonialsSwiper.nativeElement, {
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
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
            effect: 'slide',
          },
          768: {
            slidesPerView: 2,
            effect: 'slide',
          },
          1024: {
            slidesPerView: 3,
            effect: 'coverflow',
          },
        },
      });
    }
  }

  private startFloatingAnimation(): void {
    const animateFloat = () => {
      const floatingElements = document.querySelectorAll('.floating-testimonial-car');
      floatingElements.forEach((element, index) => {
        const time = Date.now() * 0.001;
        const yOffset = Math.sin(time + index * 2) * 10;
        const xOffset = Math.cos(time * 0.5 + index) * 5;
        const rotation = Math.sin(time * 0.3 + index) * 10;

        (element as HTMLElement).style.transform =
          `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`;
      });

      this.animationFrameId = requestAnimationFrame(animateFloat);
    };

    animateFloat();
  }

  generateStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  openClientProfile(testimonial: Testimonial): void {
    // Open client profile modal or page
    console.log('Opening profile for:', testimonial.name);
  }

  shareTestimonial(testimonial: Testimonial): void {
    if (this.isBrowser && navigator.share) { // Check this.isBrowser before using navigator
      navigator.share({
        title: `${testimonial.name} - DriveLink Testimonial`,
        text: testimonial.content,
        url: window.location.href
      }).catch(console.error);
    } else if (this.isBrowser && navigator.clipboard) { // Check this.isBrowser before using navigator.clipboard
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `"${testimonial.content}" - ${testimonial.name}, ${testimonial.company}`
      );
    }
  }

  contactForService(service: string): void {
    // Open contact modal with pre-selected service
    console.log('Contact for service:', service);
  }
}