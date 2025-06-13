import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteModal } from './quote-modal';

describe('QuoteModal', () => {
  let component: QuoteModal;
  let fixture: ComponentFixture<QuoteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
