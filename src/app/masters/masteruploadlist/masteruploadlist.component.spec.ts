import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasteruploadlistComponent } from './masteruploadlist.component';

describe('MasteruploadlistComponent', () => {
  let component: MasteruploadlistComponent;
  let fixture: ComponentFixture<MasteruploadlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasteruploadlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasteruploadlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
