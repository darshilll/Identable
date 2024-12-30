import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileShotsComponent } from './profile-shots.component';

describe('ProfileShotsComponent', () => {
  let component: ProfileShotsComponent;
  let fixture: ComponentFixture<ProfileShotsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileShotsComponent]
    });
    fixture = TestBed.createComponent(ProfileShotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
