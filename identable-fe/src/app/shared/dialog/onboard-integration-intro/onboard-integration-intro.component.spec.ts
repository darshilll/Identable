import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardIntegrationIntroComponent } from './onboard-integration-intro.component';

describe('OnboardIntegrationIntroComponent', () => {
  let component: OnboardIntegrationIntroComponent;
  let fixture: ComponentFixture<OnboardIntegrationIntroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardIntegrationIntroComponent]
    });
    fixture = TestBed.createComponent(OnboardIntegrationIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
