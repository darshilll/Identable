import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGeneratedVideoComponent } from './view-generated-video.component';

describe('ViewGeneratedVideoComponent', () => {
  let component: ViewGeneratedVideoComponent;
  let fixture: ComponentFixture<ViewGeneratedVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewGeneratedVideoComponent]
    });
    fixture = TestBed.createComponent(ViewGeneratedVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
