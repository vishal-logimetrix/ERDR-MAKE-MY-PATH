import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorfaqComponent } from './mentorfaq.component';

describe('MentorfaqComponent', () => {
  let component: MentorfaqComponent;
  let fixture: ComponentFixture<MentorfaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorfaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorfaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
