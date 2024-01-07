import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentReceivedComponent } from './sent-received.component';

describe('SentReceivedComponent', () => {
  let component: SentReceivedComponent;
  let fixture: ComponentFixture<SentReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
