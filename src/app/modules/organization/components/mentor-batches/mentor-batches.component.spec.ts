import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorBatchesComponent } from './mentor-batches.component';

describe('MentorBatchesComponent', () => {
  let component: MentorBatchesComponent;
  let fixture: ComponentFixture<MentorBatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorBatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
