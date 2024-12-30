import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCreativeTemplatesComponent } from './ad-creative-templates.component';

describe('AdCreativeTemplatesComponent', () => {
  let component: AdCreativeTemplatesComponent;
  let fixture: ComponentFixture<AdCreativeTemplatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdCreativeTemplatesComponent]
    });
    fixture = TestBed.createComponent(AdCreativeTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
