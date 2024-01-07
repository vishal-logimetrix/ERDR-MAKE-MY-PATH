import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticePaperComponent } from './practice-paper.component';

describe('PracticePaperComponent', () => {
  let component: PracticePaperComponent;
  let fixture: ComponentFixture<PracticePaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticePaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticePaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
