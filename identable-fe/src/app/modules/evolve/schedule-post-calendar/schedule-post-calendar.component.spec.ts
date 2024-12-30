import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePostCalendarComponent } from './schedule-post-calendar.component';

describe('SchedulePostCalendarComponent', () => {
  let component: SchedulePostCalendarComponent;
  let fixture: ComponentFixture<SchedulePostCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulePostCalendarComponent]
    });
    fixture = TestBed.createComponent(SchedulePostCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
