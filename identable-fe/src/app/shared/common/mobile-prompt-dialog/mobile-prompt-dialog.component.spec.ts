import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePromptDialogComponent } from './mobile-prompt-dialog.component';

describe('MobilePromptDialogComponent', () => {
  let component: MobilePromptDialogComponent;
  let fixture: ComponentFixture<MobilePromptDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobilePromptDialogComponent]
    });
    fixture = TestBed.createComponent(MobilePromptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
