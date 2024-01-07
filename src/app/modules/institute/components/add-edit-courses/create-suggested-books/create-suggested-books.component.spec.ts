import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSuggestedBooksComponent } from './create-suggested-books.component';

describe('CreateSuggestedBooksComponent', () => {
  let component: CreateSuggestedBooksComponent;
  let fixture: ComponentFixture<CreateSuggestedBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSuggestedBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSuggestedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
