import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationviewComponent } from './configurationview.component';

describe('ConfigurationviewComponent', () => {
  let component: ConfigurationviewComponent;
  let fixture: ComponentFixture<ConfigurationviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
