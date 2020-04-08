import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomcataloguelistComponent } from './customcataloguelist.component';

describe('CustomcataloguelistComponent', () => {
  let component: CustomcataloguelistComponent;
  let fixture: ComponentFixture<CustomcataloguelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomcataloguelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomcataloguelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
