import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilemastersellerassignComponent } from './mobilemastersellerassign.component';

describe('MobilemastersellerassignComponent', () => {
  let component: MobilemastersellerassignComponent;
  let fixture: ComponentFixture<MobilemastersellerassignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilemastersellerassignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilemastersellerassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
