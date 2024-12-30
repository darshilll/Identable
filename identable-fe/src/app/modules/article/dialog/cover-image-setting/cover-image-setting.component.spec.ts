import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverImageSettingComponent } from './cover-image-setting.component';

describe('CoverImageSettingComponent', () => {
  let component: CoverImageSettingComponent;
  let fixture: ComponentFixture<CoverImageSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoverImageSettingComponent]
    });
    fixture = TestBed.createComponent(CoverImageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
