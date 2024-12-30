import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeImageEditorComponent } from './creative-image-editor.component';

describe('CreativeImageEditorComponent', () => {
  let component: CreativeImageEditorComponent;
  let fixture: ComponentFixture<CreativeImageEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreativeImageEditorComponent]
    });
    fixture = TestBed.createComponent(CreativeImageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
