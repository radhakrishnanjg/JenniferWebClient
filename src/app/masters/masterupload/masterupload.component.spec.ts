import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasteruploadComponent } from './masterupload.component';

describe('MasteruploadComponent', () => {
  let component: MasteruploadComponent;
  let fixture: ComponentFixture<MasteruploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasteruploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasteruploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
