import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomcatalogueviewComponent } from './customcatalogueview.component';

describe('CustomcatalogueviewComponent', () => {
  let component: CustomcatalogueviewComponent;
  let fixture: ComponentFixture<CustomcatalogueviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomcatalogueviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomcatalogueviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
