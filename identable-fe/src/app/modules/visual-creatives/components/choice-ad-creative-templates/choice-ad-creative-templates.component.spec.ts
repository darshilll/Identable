import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceAdCreativeTemplatesComponent } from './choice-ad-creative-templates.component';

describe('ChoiceAdCreativeTemplatesComponent', () => {
  let component: ChoiceAdCreativeTemplatesComponent;
  let fixture: ComponentFixture<ChoiceAdCreativeTemplatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChoiceAdCreativeTemplatesComponent]
    });
    fixture = TestBed.createComponent(ChoiceAdCreativeTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
