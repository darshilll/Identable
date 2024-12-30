import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayIntroVideoComponent } from './play-intro-video.component';

describe('PlayIntroVideoComponent', () => {
  let component: PlayIntroVideoComponent;
  let fixture: ComponentFixture<PlayIntroVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayIntroVideoComponent]
    });
    fixture = TestBed.createComponent(PlayIntroVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
