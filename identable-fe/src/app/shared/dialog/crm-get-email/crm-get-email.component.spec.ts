import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmGetEmailComponent } from './crm-get-email.component';

describe('CrmGetEmailComponent', () => {
  let component: CrmGetEmailComponent;
  let fixture: ComponentFixture<CrmGetEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrmGetEmailComponent]
    });
    fixture = TestBed.createComponent(CrmGetEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
