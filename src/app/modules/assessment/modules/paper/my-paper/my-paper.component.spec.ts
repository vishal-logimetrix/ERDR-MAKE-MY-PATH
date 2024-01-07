import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPaperComponent } from './my-paper.component';

describe('MyPaperComponent', () => {
  let component: MyPaperComponent;
  let fixture: ComponentFixture<MyPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
