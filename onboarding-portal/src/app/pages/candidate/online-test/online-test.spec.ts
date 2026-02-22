import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineTest } from './online-test';

describe('OnlineTest', () => {
  let component: OnlineTest;
  let fixture: ComponentFixture<OnlineTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
