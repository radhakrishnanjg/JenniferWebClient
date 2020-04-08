import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IORCatalogueviewComponent } from './iorcatalogueview.component';

describe('IORCatalogueviewComponent', () => {
  let component: IORCatalogueviewComponent;
  let fixture: ComponentFixture<IORCatalogueviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IORCatalogueviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IORCatalogueviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
