import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalPlanForm } from './rental-plan-form';

describe('RentalPlanForm', () => {
  let component: RentalPlanForm;
  let fixture: ComponentFixture<RentalPlanForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalPlanForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RentalPlanForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
