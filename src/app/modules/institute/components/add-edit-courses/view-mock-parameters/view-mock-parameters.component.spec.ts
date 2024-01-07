import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMockParametersComponent } from './view-mock-parameters.component';

describe('ViewMockParametersComponent', () => {
  let component: ViewMockParametersComponent;
  let fixture: ComponentFixture<ViewMockParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMockParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMockParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
