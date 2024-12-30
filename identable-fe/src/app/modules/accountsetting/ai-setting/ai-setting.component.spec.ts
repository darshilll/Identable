import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSettingComponent } from './ai-setting.component';

describe('AiSettingComponent', () => {
  let component: AiSettingComponent;
  let fixture: ComponentFixture<AiSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiSettingComponent]
    });
    fixture = TestBed.createComponent(AiSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
