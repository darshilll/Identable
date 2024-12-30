import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedImageComponent } from './generated-image.component';

describe('GeneratedImageComponent', () => {
  let component: GeneratedImageComponent;
  let fixture: ComponentFixture<GeneratedImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneratedImageComponent]
    });
    fixture = TestBed.createComponent(GeneratedImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
