import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCreativeDesignLayoutComponent } from './ad-creative-design-layout.component';

describe('AdCreativeDesignLayoutComponent', () => {
  let component: AdCreativeDesignLayoutComponent;
  let fixture: ComponentFixture<AdCreativeDesignLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdCreativeDesignLayoutComponent]
    });
    fixture = TestBed.createComponent(AdCreativeDesignLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
