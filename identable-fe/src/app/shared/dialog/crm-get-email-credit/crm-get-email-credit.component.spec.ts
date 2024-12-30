import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmGetEmailCreditComponent } from './crm-get-email-credit.component';

describe('CrmGetEmailCreditComponent', () => {
  let component: CrmGetEmailCreditComponent;
  let fixture: ComponentFixture<CrmGetEmailCreditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrmGetEmailCreditComponent]
    });
    fixture = TestBed.createComponent(CrmGetEmailCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
