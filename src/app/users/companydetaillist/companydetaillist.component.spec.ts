import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanydetaillistComponent } from './companydetaillist.component';

describe('CompanydetaillistComponent', () => {
  let component: CompanydetaillistComponent;
  let fixture: ComponentFixture<CompanydetaillistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanydetaillistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanydetaillistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
