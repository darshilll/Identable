import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeDialogComponent } from './time-dialog.component';

describe('TimeDialogComponent', () => {
  let component: TimeDialogComponent;
  let fixture: ComponentFixture<TimeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeDialogComponent]
    });
    fixture = TestBed.createComponent(TimeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
