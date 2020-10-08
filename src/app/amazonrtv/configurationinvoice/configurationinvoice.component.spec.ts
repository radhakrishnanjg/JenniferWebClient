import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationinvoiceComponent } from './configurationinvoice.component';

describe('ConfigurationinvoiceComponent', () => {
  let component: ConfigurationinvoiceComponent;
  let fixture: ComponentFixture<ConfigurationinvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationinvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
