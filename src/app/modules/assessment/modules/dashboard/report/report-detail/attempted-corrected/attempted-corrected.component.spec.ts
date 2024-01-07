import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttemptedCorrectedComponent } from './attempted-corrected.component';

describe('AttemptedCorrectedComponent', () => {
  let component: AttemptedCorrectedComponent;
  let fixture: ComponentFixture<AttemptedCorrectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttemptedCorrectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttemptedCorrectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
