import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPapersComponent } from './my-papers.component';

describe('MyPapersComponent', () => {
  let component: MyPapersComponent;
  let fixture: ComponentFixture<MyPapersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPapersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
