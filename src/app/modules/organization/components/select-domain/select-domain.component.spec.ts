import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDomainComponent } from './select-domain.component';

describe('SelectDomainComponent', () => {
  let component: SelectDomainComponent;
  let fixture: ComponentFixture<SelectDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
