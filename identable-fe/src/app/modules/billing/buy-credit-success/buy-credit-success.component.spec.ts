import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCreditSuccessComponent } from './buy-credit-success.component';

describe('BuyCreditSuccessComponent', () => {
  let component: BuyCreditSuccessComponent;
  let fixture: ComponentFixture<BuyCreditSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyCreditSuccessComponent]
    });
    fixture = TestBed.createComponent(BuyCreditSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
