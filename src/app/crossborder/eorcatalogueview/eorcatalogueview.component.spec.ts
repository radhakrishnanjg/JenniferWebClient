import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EorcatalogueviewComponent } from './eorcatalogueview.component';

describe('EorcatalogueviewComponent', () => {
  let component: EorcatalogueviewComponent;
  let fixture: ComponentFixture<EorcatalogueviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EorcatalogueviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EorcatalogueviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
