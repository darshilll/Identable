import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPostScheduledComponent } from './confirm-post-scheduled.component';

describe('ConfirmPostScheduledComponent', () => {
  let component: ConfirmPostScheduledComponent;
  let fixture: ComponentFixture<ConfirmPostScheduledComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmPostScheduledComponent]
    });
    fixture = TestBed.createComponent(ConfirmPostScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
