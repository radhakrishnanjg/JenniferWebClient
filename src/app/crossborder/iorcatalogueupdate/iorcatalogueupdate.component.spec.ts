import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IORCatalogueupdateComponent } from './iorcatalogueupdate.component';

describe('IORCatalogueupdateComponent', () => {
  let component: IORCatalogueupdateComponent;
  let fixture: ComponentFixture<IORCatalogueupdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IORCatalogueupdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IORCatalogueupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
