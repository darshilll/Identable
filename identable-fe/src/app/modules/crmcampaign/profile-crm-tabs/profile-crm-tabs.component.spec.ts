import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCrmTabsComponent } from './profile-crm-tabs.component';

describe('ProfileCrmTabsComponent', () => {
  let component: ProfileCrmTabsComponent;
  let fixture: ComponentFixture<ProfileCrmTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileCrmTabsComponent]
    });
    fixture = TestBed.createComponent(ProfileCrmTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
