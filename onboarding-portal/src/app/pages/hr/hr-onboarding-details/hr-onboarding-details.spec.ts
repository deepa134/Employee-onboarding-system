import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrOnboardingDetails } from './hr-onboarding-details';

describe('HrOnboardingDetails', () => {
  let component: HrOnboardingDetails;
  let fixture: ComponentFixture<HrOnboardingDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrOnboardingDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrOnboardingDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
