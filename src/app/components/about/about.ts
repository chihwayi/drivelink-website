import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ImageResize } from '../../directives/image-resize';
import { CommonModule } from '@angular/common';

declare global {
  interface Window {
    AOS?: any;
  }
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  bio: string;
  expertise: string[];
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

interface CompanyValue {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Achievement {
  id: number;
  number: string;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-about',
  imports: [CommonModule, ImageResize],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements OnInit, OnDestroy {
  @ViewChild('aboutSection', { static: true }) aboutSection!: ElementRef;
  
  private destroy$ = new Subject<void>();
  
  // Company Values
  companyValues: CompanyValue[] = [
    {
      id: 1,
      title: 'Excellence',
      description: 'We strive for excellence in every vehicle import and export transaction, ensuring quality and reliability.',
      icon: 'bi-star-fill',
      color: '#fbbf24'
    },
    {
      id: 2,
      title: 'Trust',
      description: 'Building lasting relationships through transparency, honesty, and reliable service delivery.',
      icon: 'bi-shield-check',
      color: '#22c55e'
    },
    {
      id: 3,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology and innovative solutions to streamline the import process.',
      icon: 'bi-lightbulb-fill',
      color: '#3b82f6'
    },
    {
      id: 4,
      title: 'Global Reach',
      description: 'Connecting markets worldwide with our extensive network of partners and logistics solutions.',
      icon: 'bi-globe',
      color: '#8b5cf6'
    }
  ];

  // Team Members
  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Michael Johnson',
      position: 'CEO & Founder',
      image: 'assets/images/about/team-1.jpg',
      bio: 'With over 15 years in automotive import/export, Michael founded DriveLink to revolutionize the vehicle logistics industry.',
      expertise: ['Strategic Leadership', 'International Trade', 'Business Development'],
      social: {
        linkedin: 'https://linkedin.com/in/michael-johnson',
        email: 'michael@drivelink.com'
      }
    },
    {
      id: 2,
      name: 'Sarah Chen',
      position: 'Head of Operations',
      image: 'assets/images/about/team-2.jpg',
      bio: 'Sarah oversees all operational aspects, ensuring smooth logistics and customer satisfaction across all our services.',
      expertise: ['Operations Management', 'Logistics Optimization', 'Quality Assurance'],
      social: {
        linkedin: 'https://linkedin.com/in/sarah-chen',
        email: 'sarah@drivelink.com'
      }
    },
    {
      id: 3,
      name: 'David Rodriguez',
      position: 'Technical Director',
      image: 'assets/images/about/team-3.jpg',
      bio: 'David leads our technical innovations and oversees the development of our digital platforms and automation systems.',
      expertise: ['Technology Strategy', 'Digital Innovation', 'System Architecture'],
      social: {
        linkedin: 'https://linkedin.com/in/david-rodriguez',
        email: 'david@drivelink.com'
      }
    }
  ];

  // Company Achievements
  achievements: Achievement[] = [
    {
      id: 1,
      number: '15+',
      label: 'Years Experience',
      icon: 'bi-calendar-event',
      description: 'Over a decade of excellence in automotive logistics'
    },
    {
      id: 2,
      number: '10K+',
      label: 'Vehicles Delivered',
      icon: 'bi-truck',
      description: 'Successfully imported and exported thousands of vehicles'
    },
    {
      id: 3,
      number: '50+',
      label: 'Countries Served',
      icon: 'bi-globe-americas',
      description: 'Global reach with partners across all continents'
    },
    {
      id: 4,
      number: '99%',
      label: 'Customer Satisfaction',
      icon: 'bi-emoji-smile',
      description: 'Consistently high satisfaction rates from our clients'
    }
  ];

  // Component State
  activeTab: 'story' | 'values' | 'team' = 'story';
  isVisible = false;

  constructor() {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.setupIntersectionObserver();
      this.initializeAnimations();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Tab Navigation
  setActiveTab(tab: 'story' | 'values' | 'team'): void {
    this.activeTab = tab;
  }

  // Contact Methods
  openWhatsApp(): void {
    const phoneNumber = '+27123456789'; // Replace with actual number
    const message = 'Hi DriveLink! I would like to know more about your services.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  callUs(): void {
    window.location.href = 'tel:+27123456789'; // Replace with actual number
  }

  openMessenger(): void {
    // Replace with actual Facebook page ID
    window.open('https://m.me/drivelink', '_blank');
  }

  openLinkedIn(url?: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  sendEmail(email?: string): void {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  }

  // Private Methods
  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            this.animateOnScroll();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (this.aboutSection?.nativeElement) {
      observer.observe(this.aboutSection.nativeElement);
    }
  }

  private initializeAnimations(): void {
    import('aos').then(AOS => {
      if (window.AOS) {
        window.AOS.refresh();
      }
    });
  }

  private animateOnScroll(): void {
    // Trigger animations when section becomes visible
    const elements = this.aboutSection.nativeElement.querySelectorAll('[data-animate]');
    elements.forEach((element: Element, index: number) => {
      setTimeout(() => {
        element.classList.add('animate-in');
      }, index * 100);
    });
  }

  // Scroll to section
  scrollToTeam(): void {
    const teamSection = document.getElementById('team-section');
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToValues(): void {
    const valuesSection = document.getElementById('values-section');
    if (valuesSection) {
      valuesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
