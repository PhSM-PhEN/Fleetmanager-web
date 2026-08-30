import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTemplateForm } from './contract-template-form';

describe('ContractTemplateForm', () => {
  let component: ContractTemplateForm;
  let fixture: ComponentFixture<ContractTemplateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractTemplateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ContractTemplateForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
