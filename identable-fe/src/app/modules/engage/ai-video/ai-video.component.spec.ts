import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiVideoComponent } from './ai-video.component';

describe('AiVideoComponent', () => {
  let component: AiVideoComponent;
  let fixture: ComponentFixture<AiVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiVideoComponent]
    });
    fixture = TestBed.createComponent(AiVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
