import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostScheduleDialogComponent } from './post-schedule-dialog.component';

describe('PostScheduleDialogComponent', () => {
  let component: PostScheduleDialogComponent;
  let fixture: ComponentFixture<PostScheduleDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostScheduleDialogComponent]
    });
    fixture = TestBed.createComponent(PostScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
