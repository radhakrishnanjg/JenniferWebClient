import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilemasterotpComponent } from './mobilemasterotp.component';

describe('MobilemasterotpComponent', () => {
  let component: MobilemasterotpComponent;
  let fixture: ComponentFixture<MobilemasterotpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilemasterotpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilemasterotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
