import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplicationComponent } from './replication.component';

describe('ReplicationComponent', () => {
  let component: ReplicationComponent;
  let fixture: ComponentFixture<ReplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
