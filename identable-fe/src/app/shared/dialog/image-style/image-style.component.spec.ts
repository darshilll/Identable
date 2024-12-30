import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageStyleComponent } from './image-style.component';

describe('ImageStyleComponent', () => {
  let component: ImageStyleComponent;
  let fixture: ComponentFixture<ImageStyleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageStyleComponent]
    });
    fixture = TestBed.createComponent(ImageStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
