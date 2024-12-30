import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixelImageVideoComponent } from './pixel-image-video.component';

describe('PixelImageVideoComponent', () => {
  let component: PixelImageVideoComponent;
  let fixture: ComponentFixture<PixelImageVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PixelImageVideoComponent]
    });
    fixture = TestBed.createComponent(PixelImageVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
