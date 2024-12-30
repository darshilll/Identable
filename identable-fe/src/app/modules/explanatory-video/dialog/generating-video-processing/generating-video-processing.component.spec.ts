import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingVideoProcessingComponent } from './generating-video-processing.component';

describe('GeneratingVideoProcessingComponent', () => {
  let component: GeneratingVideoProcessingComponent;
  let fixture: ComponentFixture<GeneratingVideoProcessingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneratingVideoProcessingComponent]
    });
    fixture = TestBed.createComponent(GeneratingVideoProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
