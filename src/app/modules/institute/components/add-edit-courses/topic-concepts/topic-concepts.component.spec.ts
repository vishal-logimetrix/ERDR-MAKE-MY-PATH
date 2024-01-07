import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicConceptsComponent } from './topic-concepts.component';

describe('TopicConceptsComponent', () => {
  let component: TopicConceptsComponent;
  let fixture: ComponentFixture<TopicConceptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicConceptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicConceptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
