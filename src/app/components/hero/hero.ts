import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuoteModal } from '../modals/quote-modal/quote-modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements OnInit {
  
  stats = [
    { number: '5000+', label: 'Vehicles Exported', icon: 'bi-car-front' },
    { number: '50+', label: 'Countries Served', icon: 'bi-globe' },
    { number: '20+', label: 'Years Experience', icon: 'bi-award' },
    { number: '99%', label: 'Client Satisfaction', icon: 'bi-heart' }
  ];

  services = [
    'Vehicle Export & Import',
    'Custom Documentation',
    'Global Logistics',
    'Quality Inspection'
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

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
    window.open('https://wa.me/27123456789?text=Hello, I need help with vehicle export/import services', '_blank');
  }

  scrollToServices() {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
