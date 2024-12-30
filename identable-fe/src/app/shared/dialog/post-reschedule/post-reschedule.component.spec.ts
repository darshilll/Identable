import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostRescheduleComponent } from './post-reschedule.component';

describe('PostRescheduleComponent', () => {
  let component: PostRescheduleComponent;
  let fixture: ComponentFixture<PostRescheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostRescheduleComponent]
    });
    fixture = TestBed.createComponent(PostRescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
