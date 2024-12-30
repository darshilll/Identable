import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSettingComponent } from './text-setting.component';

describe('TextSettingComponent', () => {
  let component: TextSettingComponent;
  let fixture: ComponentFixture<TextSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextSettingComponent]
    });
    fixture = TestBed.createComponent(TextSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
