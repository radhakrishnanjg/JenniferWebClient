import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstdownloadComponent } from './gstdownload.component';

describe('GstdownloadComponent', () => {
  let component: GstdownloadComponent;
  let fixture: ComponentFixture<GstdownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstdownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstdownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
