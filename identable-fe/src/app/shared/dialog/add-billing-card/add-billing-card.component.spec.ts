import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBillingCardComponent } from './add-billing-card.component';

describe('AddBillingCardComponent', () => {
  let component: AddBillingCardComponent;
  let fixture: ComponentFixture<AddBillingCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBillingCardComponent]
    });
    fixture = TestBed.createComponent(AddBillingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
