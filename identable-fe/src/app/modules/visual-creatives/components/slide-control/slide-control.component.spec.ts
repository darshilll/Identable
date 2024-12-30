import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideControlComponent } from './slide-control.component';

describe('SlideControlComponent', () => {
  let component: SlideControlComponent;
  let fixture: ComponentFixture<SlideControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlideControlComponent]
    });
    fixture = TestBed.createComponent(SlideControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
