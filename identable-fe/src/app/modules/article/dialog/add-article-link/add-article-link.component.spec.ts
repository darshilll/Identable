import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArticleLinkComponent } from './add-article-link.component';

describe('AddArticleLinkComponent', () => {
  let component: AddArticleLinkComponent;
  let fixture: ComponentFixture<AddArticleLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddArticleLinkComponent]
    });
    fixture = TestBed.createComponent(AddArticleLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
