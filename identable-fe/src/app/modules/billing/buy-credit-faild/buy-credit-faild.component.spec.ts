import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCreditFaildComponent } from './buy-credit-faild.component';

describe('BuyCreditFaildComponent', () => {
  let component: BuyCreditFaildComponent;
  let fixture: ComponentFixture<BuyCreditFaildComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyCreditFaildComponent]
    });
    fixture = TestBed.createComponent(BuyCreditFaildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
