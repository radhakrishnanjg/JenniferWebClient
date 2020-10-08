import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationapprovalComponent } from './configurationapproval.component';

describe('ConfigurationapprovalComponent', () => {
  let component: ConfigurationapprovalComponent;
  let fixture: ComponentFixture<ConfigurationapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
