import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchLeaderboardComponent } from './batch-leaderboard.component';

describe('BatchLeaderboardComponent', () => {
  let component: BatchLeaderboardComponent;
  let fixture: ComponentFixture<BatchLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
