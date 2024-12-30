import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBackgroundImageComponent } from './set-background-image.component';

describe('SetBackgroundImageComponent', () => {
  let component: SetBackgroundImageComponent;
  let fixture: ComponentFixture<SetBackgroundImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetBackgroundImageComponent]
    });
    fixture = TestBed.createComponent(SetBackgroundImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
