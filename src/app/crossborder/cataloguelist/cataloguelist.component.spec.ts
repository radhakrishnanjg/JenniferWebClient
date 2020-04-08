import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CataloguelistComponent } from './cataloguelist.component';

describe('CataloguelistComponent', () => {
  let component: CataloguelistComponent;
  let fixture: ComponentFixture<CataloguelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CataloguelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CataloguelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
