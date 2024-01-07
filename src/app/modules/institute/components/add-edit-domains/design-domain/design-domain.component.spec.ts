import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignDomainComponent } from './design-domain.component';

describe('DesignDomainComponent', () => {
  let component: DesignDomainComponent;
  let fixture: ComponentFixture<DesignDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
