import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationmanualComponent } from './configurationmanual.component';

describe('ConfigurationmanualComponent', () => {
  let component: ConfigurationmanualComponent;
  let fixture: ComponentFixture<ConfigurationmanualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationmanualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationmanualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
