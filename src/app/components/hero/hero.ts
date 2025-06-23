import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuoteModal } from '../modals/quote-modal/quote-modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements OnInit, OnDestroy {

  services = [
    'Vehicle Export & Import',
    'Custom Documentation',
    'Global Logistics',
    'Quality Inspection'
  ];

  // Car brands for the slider
  carBrands = [
    {
      id: 7,
      brand: 'Mercedes-Benz',
      model: 'S-Class',
      image: 'assets/images/cars/mercedes-s-class.jpg',
      description: 'Luxury redefined',
      price: 'From $95,000'
    },
    {
      id: 6,
      brand: 'BMW',
      model: 'X7',
      image: 'assets/images/cars/bmw-x7.jpg',
      description: 'Ultimate driving machine',
      price: 'From $75,000'
    },
    {
      id: 5,
      brand: 'Audi',
      model: 'A8',
      image: 'assets/images/cars/audi-a8.jpg',
      description: 'Progress through technology',
      price: 'From $85,000'
    },
    {
      id: 4,
      brand: 'Lexus',
      model: 'LX 600',
      image: 'assets/images/cars/lexus-lx.jpeg',
      description: 'Pursuit of perfection',
      price: 'From $88,000'
    },
    {
      id: 3,
      brand: 'Range Rover',
      model: 'Vogue',
      image: 'assets/images/cars/range-rover.jpg',
      description: 'Above and beyond',
      price: 'From $92,000'
    },
    {
      id: 2,
      brand: 'Porsche',
      model: 'Cayenne',
      image: 'assets/images/cars/porsche-cayenne.jpg',
      description: 'There is no substitute',
      price: 'From $70,000'
    },
    {
      id: 1,
      brand: 'Toyota',
      model: 'Hilux',
      image: 'assets/images/cars/toyota-hilux.png',
      description: 'Durability at its best',
      price: 'From $70,000'
    },
    {
      id: 8,
      brand: 'Ford',
      model: 'Raptor',
      image: 'assets/images/cars/ford-raptor.jpg',
      description: 'Technology and speed combined',
      price: 'From $70,000'
    }
  ];

  currentSlide = 0;
  private slideInterval: any;

  // Calculate slide width percentage based on number of slides
  get slideWidthPercentage(): number {
    return 100 / this.carBrands.length;
  }

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 2000); // Change slide every 4 seconds
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carBrands.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.carBrands.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    // Restart auto-slide when user manually changes slide
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startAutoSlide();
    }
  }

  // Get transform value for slider
  getSliderTransform(): string {
    return `translateX(-${this.currentSlide * this.slideWidthPercentage}%)`;
  }

  openQuoteModal() {
    const dialogRef = this.dialog.open(QuoteModal, {
      width: '500px',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Quote request:', result);
      }
    });
  }

  openWhatsApp() {
    window.open('https://wa.me/27746964384?text=Hello, I need help with vehicle export/import services', '_blank');
  }

  scrollToServices() {
    const element = document.getElementById('gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}