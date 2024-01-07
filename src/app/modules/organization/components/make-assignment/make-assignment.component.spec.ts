import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeAssignmentComponent } from './make-assignment.component';

describe('MakeAssignmentComponent', () => {
  let component: MakeAssignmentComponent;
  let fixture: ComponentFixture<MakeAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
