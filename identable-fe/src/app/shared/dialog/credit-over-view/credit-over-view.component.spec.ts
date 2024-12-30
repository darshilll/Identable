import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditOverViewComponent } from './credit-over-view.component';

describe('CreditOverViewComponent', () => {
  let component: CreditOverViewComponent;
  let fixture: ComponentFixture<CreditOverViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditOverViewComponent]
    });
    fixture = TestBed.createComponent(CreditOverViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
