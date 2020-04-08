import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CataloguecreateComponent } from './cataloguecreate.component';

describe('CataloguecreateComponent', () => {
  let component: CataloguecreateComponent;
  let fixture: ComponentFixture<CataloguecreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CataloguecreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CataloguecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
