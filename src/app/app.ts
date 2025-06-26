import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Header } from "./components/header/header";
import { Hero } from "./components/hero/hero";
import { Process } from "./components/process/process";
import { Footer } from "./components/footer/footer";
import { Gallery } from "./components/gallery/gallery";
import { ImportExport } from "./components/import-export/import-export";
import { Faq } from "./components/faq/faq";
import { Contact } from './services/contact';

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

  constructor(private viewportScroller: ViewportScroller, private contactService: Contact) {}

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
    this.contactService.openMessenger();
  }

  openWhatsApp() {
    window.open('https://wa.me/27746964384', '_blank');
  }

  callUs(): void {
  this.contactService.makePhoneCall('+27746964384');
}

  scrollToSection(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }
}
