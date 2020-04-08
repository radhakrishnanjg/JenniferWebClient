import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilemasterviewComponent } from './mobilemasterview.component';

describe('MobilemasterviewComponent', () => {
  let component: MobilemasterviewComponent;
  let fixture: ComponentFixture<MobilemasterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilemasterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilemasterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
