import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignJourneyComponent } from './design-journey.component';

describe('DesignJourneyComponent', () => {
  let component: DesignJourneyComponent;
  let fixture: ComponentFixture<DesignJourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignJourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
