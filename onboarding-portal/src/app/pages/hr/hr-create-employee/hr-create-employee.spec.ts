import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrCreateEmployee } from './hr-create-employee';

describe('HrCreateEmployee', () => {
  let component: HrCreateEmployee;
  let fixture: ComponentFixture<HrCreateEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrCreateEmployee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrCreateEmployee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
