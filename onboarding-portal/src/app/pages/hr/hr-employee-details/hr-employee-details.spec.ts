import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEmployeeDetails } from './hr-employee-details';

describe('HrEmployeeDetails', () => {
  let component: HrEmployeeDetails;
  let fixture: ComponentFixture<HrEmployeeDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrEmployeeDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrEmployeeDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
