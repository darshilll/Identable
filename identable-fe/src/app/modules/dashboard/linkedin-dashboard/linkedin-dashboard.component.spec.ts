import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinDashboardComponent } from './linkedin-dashboard.component';

describe('LinkedinDashboardComponent', () => {
  let component: LinkedinDashboardComponent;
  let fixture: ComponentFixture<LinkedinDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedinDashboardComponent]
    });
    fixture = TestBed.createComponent(LinkedinDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
