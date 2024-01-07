import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedBooksComponent } from './suggested-books.component';

describe('SuggestedBooksComponent', () => {
  let component: SuggestedBooksComponent;
  let fixture: ComponentFixture<SuggestedBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
