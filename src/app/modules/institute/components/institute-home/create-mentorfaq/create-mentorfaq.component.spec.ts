import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMentorfaqComponent } from './create-mentorfaq.component';

describe('CreateMentorfaqComponent', () => {
  let component: CreateMentorfaqComponent;
  let fixture: ComponentFixture<CreateMentorfaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMentorfaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMentorfaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
