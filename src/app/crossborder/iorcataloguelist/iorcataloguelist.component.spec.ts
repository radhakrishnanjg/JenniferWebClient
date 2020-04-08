import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IORCataloguelistComponent } from './iorcataloguelist.component';

describe('IORCataloguelistComponent', () => {
  let component: IORCataloguelistComponent;
  let fixture: ComponentFixture<IORCataloguelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IORCataloguelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IORCataloguelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
