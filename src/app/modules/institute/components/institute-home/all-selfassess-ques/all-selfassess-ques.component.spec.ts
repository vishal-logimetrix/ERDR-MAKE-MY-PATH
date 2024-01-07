import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSelfassessQuesComponent } from './all-selfassess-ques.component';

describe('AllSelfassessQuesComponent', () => {
  let component: AllSelfassessQuesComponent;
  let fixture: ComponentFixture<AllSelfassessQuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSelfassessQuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSelfassessQuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
