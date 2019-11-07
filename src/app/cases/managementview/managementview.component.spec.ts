import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementviewComponent } from './managementview.component';

describe('ManagementviewComponent', () => {
  let component: ManagementviewComponent;
  let fixture: ComponentFixture<ManagementviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
