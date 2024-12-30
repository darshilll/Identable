import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditBuyComponent } from './credit-buy.component';

describe('CreditBuyComponent', () => {
  let component: CreditBuyComponent;
  let fixture: ComponentFixture<CreditBuyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditBuyComponent]
    });
    fixture = TestBed.createComponent(CreditBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
