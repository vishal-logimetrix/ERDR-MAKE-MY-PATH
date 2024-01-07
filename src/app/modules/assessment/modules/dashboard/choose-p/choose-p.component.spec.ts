import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePComponent } from './choose-p.component';

describe('ChoosePComponent', () => {
  let component: ChoosePComponent;
  let fixture: ComponentFixture<ChoosePComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
