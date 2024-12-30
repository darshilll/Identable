import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveThemeComponent } from './save-theme.component';

describe('SaveThemeComponent', () => {
  let component: SaveThemeComponent;
  let fixture: ComponentFixture<SaveThemeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveThemeComponent]
    });
    fixture = TestBed.createComponent(SaveThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
