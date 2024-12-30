import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJobRequestFilterComponent } from './admin-job-request-filter.component';

describe('AdminJobRequestFilterComponent', () => {
  let component: AdminJobRequestFilterComponent;
  let fixture: ComponentFixture<AdminJobRequestFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminJobRequestFilterComponent]
    });
    fixture = TestBed.createComponent(AdminJobRequestFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
