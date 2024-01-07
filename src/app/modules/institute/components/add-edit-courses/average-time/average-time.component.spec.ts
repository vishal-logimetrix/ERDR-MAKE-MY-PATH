import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageTimeComponent } from './average-time.component';

describe('AverageTimeComponent', () => {
  let component: AverageTimeComponent;
  let fixture: ComponentFixture<AverageTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AverageTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
