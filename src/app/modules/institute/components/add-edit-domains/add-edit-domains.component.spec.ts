import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDomainsComponent } from './add-edit-domains.component';

describe('AddEditDomainsComponent', () => {
  let component: AddEditDomainsComponent;
  let fixture: ComponentFixture<AddEditDomainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditDomainsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
