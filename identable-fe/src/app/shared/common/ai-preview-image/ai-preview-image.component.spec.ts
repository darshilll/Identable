import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiPreviewImageComponent } from './ai-preview-image.component';

describe('AiPreviewImageComponent', () => {
  let component: AiPreviewImageComponent;
  let fixture: ComponentFixture<AiPreviewImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiPreviewImageComponent]
    });
    fixture = TestBed.createComponent(AiPreviewImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
