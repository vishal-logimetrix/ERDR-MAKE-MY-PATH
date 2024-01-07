import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePaperComponent } from './make-paper.component';

describe('MakePaperComponent', () => {
  let component: MakePaperComponent;
  let fixture: ComponentFixture<MakePaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakePaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
