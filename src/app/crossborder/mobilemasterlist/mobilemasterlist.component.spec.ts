import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilemasterlistComponent } from './mobilemasterlist.component';

describe('MobilemasterlistComponent', () => {
  let component: MobilemasterlistComponent;
  let fixture: ComponentFixture<MobilemasterlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilemasterlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilemasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
