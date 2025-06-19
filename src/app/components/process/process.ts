import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ExportStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  isActive?: boolean;
}


@Component({
  selector: 'app-process',
  imports: [CommonModule],
  templateUrl: './process.html',
  styleUrl: './process.scss'
})
export class Process implements OnInit {

  exportSteps: ExportStep[] = [
    {
      id: 1,
      title: 'Choose Your Vehicle',
      subtitle: 'Vehicle Selection',
      description: 'Browse our extensive inventory and select the perfect vehicle that meets your requirements and budget.',
      icon: 'fas fa-car'
    },
    {
      id: 2,
      title: 'Get A Quotation',
      subtitle: 'Comprehensive Quote',
      description: 'Receive a comprehensive CIF quotation from our team, including a prompt VAT refund offered as a reduction to your overall cost.',
      icon: 'fas fa-file-invoice-dollar'
    },
    {
      id: 3,
      title: 'Invoice and Payment',
      subtitle: 'Secure Transaction',
      description: 'Get a detailed dealership quote and complete your payment through our secure payment system.',
      icon: 'fas fa-credit-card'
    },
    {
      id: 4,
      title: 'Payment and Vehicle Insurance',
      subtitle: 'Protection Coverage',
      description: 'After payment confirmation, we initiate export preparations. Your vehicle is insured under our Motor Policy throughout the shipping process.',
      icon: 'fas fa-shield-alt'
    },
    {
      id: 5,
      title: 'Export Preparations',
      subtitle: 'Documentation Process',
      description: 'We handle all necessary documentation, customs clearance, and export preparations to ensure compliance with regulations.',
      icon: 'fas fa-clipboard-check'
    },
    {
      id: 6,
      title: 'Logistics and Dispatch',
      subtitle: 'Shipping Coordination',
      description: 'Your vehicle is carefully loaded and secured for shipping. Marine insurance for ocean freight is quoted separately.',
      icon: 'fas fa-ship'
    },
    {
      id: 7,
      title: 'Delivery and Arrival',
      subtitle: 'Final Destination',
      description: 'Track your vehicle\'s journey and receive it at your designated port of arrival in perfect condition.',
      icon: 'fas fa-map-marker-alt'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // You can add any initialization logic here
  }

  onStepClick(step: ExportStep): void {
    // Handle step click if needed
    console.log('Step clicked:', step.title);
  }

  onContactClick(): void {
    // Handle contact button click
    console.log('Contact clicked');
  }

  onQuoteClick(): void {
    // Handle get quote button click
    console.log('Get quote clicked');
  }
}