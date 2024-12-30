import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCarouselConformationComponent } from './delete-carousel-conformation.component';

describe('DeleteCarouselConformationComponent', () => {
  let component: DeleteCarouselConformationComponent;
  let fixture: ComponentFixture<DeleteCarouselConformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteCarouselConformationComponent]
    });
    fixture = TestBed.createComponent(DeleteCarouselConformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
