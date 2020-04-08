import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EorcataloguelistComponent } from './eorcataloguelist.component';

describe('EorcataloguelistComponent', () => {
  let component: EorcataloguelistComponent;
  let fixture: ComponentFixture<EorcataloguelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EorcataloguelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EorcataloguelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
