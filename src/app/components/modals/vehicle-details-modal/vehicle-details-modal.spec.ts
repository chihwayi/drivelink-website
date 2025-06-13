import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsModal } from './vehicle-details-modal';

describe('VehicleDetailsModal', () => {
  let component: VehicleDetailsModal;
  let fixture: ComponentFixture<VehicleDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
