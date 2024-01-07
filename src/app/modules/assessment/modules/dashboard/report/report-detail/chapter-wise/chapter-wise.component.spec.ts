import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterWiseComponent } from './chapter-wise.component';

describe('ChapterWiseComponent', () => {
  let component: ChapterWiseComponent;
  let fixture: ComponentFixture<ChapterWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChapterWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
