import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousPapersComponent } from './previous-papers.component';

describe('PreviousPapersComponent', () => {
  let component: PreviousPapersComponent;
  let fixture: ComponentFixture<PreviousPapersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousPapersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousPapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
