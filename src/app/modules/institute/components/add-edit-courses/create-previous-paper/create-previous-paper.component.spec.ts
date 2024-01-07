import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePreviousPaperComponent } from './create-previous-paper.component';

describe('CreatePreviousPaperComponent', () => {
  let component: CreatePreviousPaperComponent;
  let fixture: ComponentFixture<CreatePreviousPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePreviousPaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePreviousPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
