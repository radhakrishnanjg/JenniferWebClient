import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementlistComponent } from './managementlist.component';

describe('ManagementlistComponent', () => {
  let component: ManagementlistComponent;
  let fixture: ComponentFixture<ManagementlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
