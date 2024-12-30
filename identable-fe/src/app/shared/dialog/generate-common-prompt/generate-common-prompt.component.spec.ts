import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCommonPromptComponent } from './generate-common-prompt.component';

describe('GenerateCommonPromptComponent', () => {
  let component: GenerateCommonPromptComponent;
  let fixture: ComponentFixture<GenerateCommonPromptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateCommonPromptComponent]
    });
    fixture = TestBed.createComponent(GenerateCommonPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
