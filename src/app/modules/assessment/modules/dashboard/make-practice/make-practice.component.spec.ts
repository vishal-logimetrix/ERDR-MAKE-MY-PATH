import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePracticeComponent } from './make-practice.component';

describe('MakePracticeComponent', () => {
  let component: MakePracticeComponent;
  let fixture: ComponentFixture<MakePracticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakePracticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
