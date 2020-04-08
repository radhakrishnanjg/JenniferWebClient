import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilemasterComponent } from './mobilemaster.component';

describe('MobilemasterComponent', () => {
  let component: MobilemasterComponent;
  let fixture: ComponentFixture<MobilemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
