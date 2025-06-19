import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'export' | 'general';
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss'
})
export class Faq {
  faqs: FAQ[] = [
    // Export Q&A
    {
      id: 1,
      question: "Does Goldstar's export services include pre-owned cars?",
      answer: "Yes, Goldstar's export services include pre-owned cars. We handle the export of both new and pre-owned vehicles to various African countries, ensuring all necessary documentation and compliance requirements are met.",
      category: 'export',
      isOpen: false
    },
    {
      id: 2,
      question: "Does Goldstar take care of all the paperwork and compliance matters related to vehicle exports?",
      answer: "Yes, at Goldstar we take care of all the paperwork and compliance matters. This includes obtaining export permits, handling registration documents, police clearance certificates, bills of lading, and commercial invoices.",
      category: 'export',
      isOpen: false
    },
    {
      id: 3,
      question: "What export services are offered to car dealerships?",
      answer: "We offer comprehensive export services to car dealerships including bulk vehicle exports, documentation handling, logistics coordination, shipping arrangements, and compliance management for multiple vehicle exports.",
      category: 'export',
      isOpen: false
    },
    {
      id: 4,
      question: "How do you ensure safe transportation and arrival of vehicles?",
      answer: "We ensure safe transportation through professional shipping partners, secure container loading, comprehensive insurance coverage, real-time tracking, and proper vehicle preparation for international transport.",
      category: 'export',
      isOpen: false
    },
    {
      id: 5,
      question: "What costs will I incur when exporting a vehicle?",
      answer: "Export costs include documentation fees, shipping charges, insurance, customs duties, port charges, and destination country import duties. We provide detailed cost breakdowns for complete transparency.",
      category: 'export',
      isOpen: false
    },
    {
      id: 6,
      question: "Why should I choose Goldstar?",
      answer: "Choose Goldstar for our extensive experience in African vehicle exports, comprehensive service handling, competitive pricing, reliable shipping partners, and excellent customer support throughout the export process.",
      category: 'export',
      isOpen: false
    },
    // General Q&A
    {
      id: 7,
      question: "What documents are required to export a vehicle from South Africa?",
      answer: "You will need the vehicle's registration documents, proof of ownership, an export permit, and a police clearance certificate. Additionally, you may need a bill of lading and a commercial invoice. At Goldstar we take care of all the paperwork.",
      category: 'general',
      isOpen: false
    },
    {
      id: 8,
      question: "How long does it take to export a vehicle to another African country?",
      answer: "The duration varies based on the destination and shipping method, but it typically takes between 4 to 8 weeks from the date of shipment.",
      category: 'general',
      isOpen: false
    },
    {
      id: 9,
      question: "Are there any vehicle restrictions for export?",
      answer: "Yes, some countries have restrictions on vehicle age, emissions standards, and left-hand or right-hand drive specifications. It's important to check the regulations of the destination country.",
      category: 'general',
      isOpen: false
    },
    {
      id: 10,
      question: "How is the vehicle transported?",
      answer: "Vehicles can be transported by sea in a container or via roll-on/roll-off (RoRo) services. The method depends on the destination and the exporter's preference.",
      category: 'general',
      isOpen: false
    },
    {
      id: 11,
      question: "How do I ensure my vehicle meets the destination country's standards?",
      answer: "Research the specific import regulations of the destination country, including any required modifications to meet safety and emissions standards.",
      category: 'general',
      isOpen: false
    },
    {
      id: 12,
      question: "What is the process for clearing customs at the destination?",
      answer: "Upon arrival, the vehicle must clear customs. This involves submitting necessary documentation, paying applicable duties and taxes, and passing any required inspections.",
      category: 'general',
      isOpen: false
    }
  ];

  filteredFaqs: FAQ[] = [];
  activeCategory: 'all' | 'export' | 'general' = 'all';
  searchQuery: string = '';

  ngOnInit(): void {
    this.filteredFaqs = [...this.faqs];
  }

  toggleFaq(faqId: number): void {
    const faq = this.faqs.find(f => f.id === faqId);
    if (faq) {
      faq.isOpen = !faq.isOpen;
    }
  }

  filterByCategory(category: 'all' | 'export' | 'general'): void {
    this.activeCategory = category;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.faqs];

    // Filter by category
    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === this.activeCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query)
      );
    }

    this.filteredFaqs = filtered;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  trackById(index: number, faq: any): any {
  return faq.id;
}
}
