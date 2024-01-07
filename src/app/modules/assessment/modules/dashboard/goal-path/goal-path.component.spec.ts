import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalPathComponent } from './goal-path.component';

describe('GoalPathComponent', () => {
  let component: GoalPathComponent;
  let fixture: ComponentFixture<GoalPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
