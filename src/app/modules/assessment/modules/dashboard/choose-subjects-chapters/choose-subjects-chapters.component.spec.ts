import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSubjectsChaptersComponent } from './choose-subjects-chapters.component';

describe('ChooseSubjectsChaptersComponent', () => {
  let component: ChooseSubjectsChaptersComponent;
  let fixture: ComponentFixture<ChooseSubjectsChaptersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseSubjectsChaptersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSubjectsChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
