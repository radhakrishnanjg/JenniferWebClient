import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplicationlistComponent } from './replicationlist.component';

describe('ReplicationlistComponent', () => {
  let component: ReplicationlistComponent;
  let fixture: ComponentFixture<ReplicationlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplicationlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplicationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
