import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomcatalogueupdateComponent } from './customcatalogueupdate.component';

describe('CustomcatalogueupdateComponent', () => {
  let component: CustomcatalogueupdateComponent;
  let fixture: ComponentFixture<CustomcatalogueupdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomcatalogueupdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomcatalogueupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
