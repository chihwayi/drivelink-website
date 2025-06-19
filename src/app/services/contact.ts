import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  manager: string;
  services: string[];
  image: string;
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class Contact {
  private contactInfoSubject = new BehaviorSubject<ContactInfo>(this.getDefaultContactInfo());
  public contactInfo$ = this.contactInfoSubject.asObservable();

  private branchesSubject = new BehaviorSubject<Branch[]>(this.getDefaultBranches());
  public branches$ = this.branchesSubject.asObservable();

  constructor() {}

  /**
   * Get contact information
   */
  getContactInfo(): Observable<ContactInfo> {
    return this.contactInfo$;
  }

  /**
   * Get all branches
   */
  getBranches(): Observable<Branch[]> {
    return this.branches$;
  }

  /**
   * Get branch by ID
   */
  getBranchById(id: string): Branch | undefined {
    return this.branchesSubject.value.find(branch => branch.id === id);
  }

  /**
   * Open WhatsApp chat
   */
  openWhatsApp(message: string = 'Hello! I would like to inquire about your services.'): void {
    const contactInfo = this.contactInfoSubject.value;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Open phone dialer
   */
  makePhoneCall(phoneNumber?: string): void {
    const contactInfo = this.contactInfoSubject.value;
    const phone = phoneNumber || contactInfo.phone;
    const telUrl = `tel:${phone.replace(/\D/g, '')}`;
    window.open(telUrl, '_self');
  }

  /**
   * Open email client
   */
  sendEmail(subject: string = 'Inquiry about DriveLink Services', body: string = ''): void {
    const contactInfo = this.contactInfoSubject.value;
    const mailtoUrl = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_self');
  }

  /**
   * Open Google Maps with directions
   */
  getDirections(destination?: string): void {
    const contactInfo = this.contactInfoSubject.value;
    const address = destination || contactInfo.address;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  }

  /**
   * Open location in maps
   */
  viewLocation(coordinates?: { lat: number; lng: number }): void {
    const contactInfo = this.contactInfoSubject.value;
    const coords = coordinates || contactInfo.coordinates;
    const mapsUrl = `https://www.google.com/maps/@${coords.lat},${coords.lng},15z`;
    window.open(mapsUrl, '_blank');
  }

  /**
   * Open Facebook page
   */
  openFacebookPage(): void {
    const contactInfo = this.contactInfoSubject.value;
    window.open(contactInfo.socialMedia.facebook, '_blank');
  }

  /**
   * Open Facebook Messenger
   */
  openMessenger(): void {
    const contactInfo = this.contactInfoSubject.value;
    const messengerUrl = `https://m.me/${contactInfo.socialMedia.facebook.split('/').pop()}`;
    window.open(messengerUrl, '_blank');
  }

  /**
   * Open Instagram page
   */
  openInstagram(): void {
    const contactInfo = this.contactInfoSubject.value;
    window.open(contactInfo.socialMedia.instagram, '_blank');
  }

  /**
   * Open Twitter page
   */
  openTwitter(): void {
    const contactInfo = this.contactInfoSubject.value;
    window.open(contactInfo.socialMedia.twitter, '_blank');
  }

  /**
   * Open LinkedIn page
   */
  openLinkedIn(): void {
    const contactInfo = this.contactInfoSubject.value;
    window.open(contactInfo.socialMedia.linkedin, '_blank');
  }

  /**
   * Open YouTube channel
   */
  openYouTube(): void {
    const contactInfo = this.contactInfoSubject.value;
    window.open(contactInfo.socialMedia.youtube, '_blank');
  }

  /**
   * Check if business is currently open
   */
  isBusinessOpen(): boolean {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const contactInfo = this.contactInfoSubject.value;
    const todayHours = (contactInfo.businessHours as any)[currentDay];
    
    if (todayHours === 'Closed') {
      return false;
    }
    
    const [openTime, closeTime] = todayHours.split(' - ');
    const openMinutes = this.timeToMinutes(openTime);
    const closeMinutes = this.timeToMinutes(closeTime);
    
    return currentTime >= openMinutes && currentTime <= closeMinutes;
  }

  /**
   * Get business status message
   */
  getBusinessStatus(): string {
    const isOpen = this.isBusinessOpen();
    return isOpen ? 'Open Now' : 'Closed';
  }

  /**
   * Get next opening time
   */
  getNextOpeningTime(): string {
    const contactInfo = this.contactInfoSubject.value;
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + i);
      const dayName = days[checkDate.getDay()];
      
      const hours = (contactInfo.businessHours as any)[dayName];
      if (hours !== 'Closed') {
        const [openTime] = hours.split(' - ');
        if (i === 0) {
          // Today - check if still time to open
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const openMinutes = this.timeToMinutes(openTime);
          if (currentTime < openMinutes) {
            return `Opens today at ${openTime}`;
          }
        } else {
          const dayLabel = i === 1 ? 'tomorrow' : checkDate.toLocaleDateString('en-US', { weekday: 'long' });
          return `Opens ${dayLabel} at ${openTime}`;
        }
      }
    }
    
    return 'Contact us for business hours';
  }

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  /**
   * Convert time string to minutes
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Get default contact information
   */
  private getDefaultContactInfo(): ContactInfo {
    return {
      phone: '+27 74 696 4384',
      whatsapp: '+27 74 696 4384',
      email: 'info@drivelinkauto.co.za',
      address: '123 Auto Drive, Car City, CC 12345',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      },
      businessHours: {
        monday: '8:00 - 18:00',
        tuesday: '8:00 - 18:00',
        wednesday: '8:00 - 18:00',
        thursday: '8:00 - 18:00',
        friday: '8:00 - 18:00',
        saturday: '9:00 - 17:00',
        sunday: 'Closed'
      },
      socialMedia: {
        facebook: 'https://facebook.com/drivelink',
        instagram: 'https://instagram.com/drivelink',
        twitter: 'https://twitter.com/drivelink',
        linkedin: 'https://linkedin.com/company/drivelink',
        youtube: 'https://youtube.com/drivelink'
      }
    };
  }

  /**
   * Get default branches
   */
private getDefaultBranches(): Branch[] {
  return [
    {
      id: 'main',
      name: 'DriveLink Main Branch',
      address: '123 Auto Drive, Car City, CC 12345',
      phone: '+27 74 696 4384',
      email: 'info@drivelinkauto.com',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      manager: 'John Smith',
      services: ['Sales', 'Service', 'Parts', 'Financing'],
      image: 'assets/images/branches/main-branch.jpg',
      businessHours: {
        monday: '8:00 - 18:00',
        tuesday: '8:00 - 18:00',
        wednesday: '8:00 - 18:00',
        thursday: '8:00 - 18:00',
        friday: '8:00 - 18:00',
        saturday: '9:00 - 17:00',
        sunday: 'Closed'
      }
    },
    {
      id: 'north',
      name: 'DriveLink North Branch',
      address: '456 Motor Street, North City, NC 67890',
      phone: '+1-800-DRIVE-02',
      email: 'north@drivelink.com',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      manager: 'Sarah Johnson',
      services: ['Sales', 'Service', 'Parts'],
      image: 'assets/images/branches/north-branch.jpg',
      businessHours: {
        monday: '8:00 - 18:00',
        tuesday: '8:00 - 18:00',
        wednesday: '8:00 - 18:00',
        thursday: '8:00 - 18:00',
        friday: '8:00 - 18:00',
        saturday: '9:00 - 17:00',
        sunday: 'Closed'
      }
    },
    {
      id: 'south',
      name: 'DriveLink South Branch',
      address: '789 Vehicle Avenue, South City, SC 54321',
      phone: '+1-800-DRIVE-03',
      email: 'south@drivelink.com',
      coordinates: { lat: 40.6892, lng: -74.0445 },
      manager: 'Mike Davis',
      services: ['Sales', 'Service', 'Financing'],
      image: 'assets/images/branches/south-branch.jpg',
      businessHours: {
        monday: '8:00 - 18:00',
        tuesday: '8:00 - 18:00',
        wednesday: '8:00 - 18:00',
        thursday: '8:00 - 18:00',
        friday: '8:00 - 18:00',
        saturday: '9:00 - 17:00',
        sunday: 'Closed'
      }
    }
  ];
}

  /**
   * Update contact information (for admin use)
   */
  updateContactInfo(contactInfo: ContactInfo): void {
    this.contactInfoSubject.next(contactInfo);
  }

  /**
   * Update branches (for admin use)
   */
  updateBranches(branches: Branch[]): void {
    this.branchesSubject.next(branches);
  }

  /**
   * Add new branch (for admin use)
   */
  addBranch(branch: Branch): void {
    const currentBranches = this.branchesSubject.value;
    this.branchesSubject.next([...currentBranches, branch]);
  }

  /**
   * Remove branch (for admin use)
   */
  removeBranch(branchId: string): void {
    const currentBranches = this.branchesSubject.value;
    const updatedBranches = currentBranches.filter(branch => branch.id !== branchId);
    this.branchesSubject.next(updatedBranches);
  }

  async saveQuoteRequest(formData: any): Promise<void> {
    // Implement saving logic here (e.g., send to backend or store locally)
    // For now, just simulate with a resolved promise
    return Promise.resolve();
  }
}
