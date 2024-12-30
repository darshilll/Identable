import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireAnExpertComponent } from './hire-an-expert.component';

describe('HireAnExpertComponent', () => {
  let component: HireAnExpertComponent;
  let fixture: ComponentFixture<HireAnExpertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HireAnExpertComponent]
    });
    fixture = TestBed.createComponent(HireAnExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
