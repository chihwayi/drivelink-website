import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Header } from "./components/header/header";
import { Hero } from "./components/hero/hero";
import { Process } from "./components/process/process";
import { Footer } from "./components/footer/footer";
import { Gallery } from "./components/gallery/gallery";
import { ImportExport } from "./components/import-export/import-export";
import { Faq } from "./components/faq/faq";

@Component({
  selector: 'app-root',
  imports: [CommonModule, Header, Hero, Process, Footer, Gallery, ImportExport, Faq],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected title = 'DriveLink - Your Global Vehicle Partner';
  showBackToTop = false;
  isLoading: boolean = false;

  constructor(private viewportScroller: ViewportScroller) {}

  ngOnInit() {
    // Only initialize AOS on client side
    if (typeof window !== 'undefined') {
      import('aos').then(AOS => {
        AOS.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
          mirror: false
        });
      });

      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }

onScroll() {
  this.showBackToTop = window.pageYOffset > 200;
}

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openMessenger() {
    window.open('https://m.me/yourpageusername', '_blank');
  }

  openWhatsApp() {
    window.open('https://wa.me/your-number', '_blank');
  }

  callUs() {
    window.open('tel:+1234567890', '_self');
  }

  scrollToSection(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }
}
