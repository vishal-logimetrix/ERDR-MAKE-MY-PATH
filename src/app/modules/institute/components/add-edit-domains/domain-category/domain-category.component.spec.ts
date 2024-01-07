import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainCategoryComponent } from './domain-category.component';

describe('DomainCategoryComponent', () => {
  let component: DomainCategoryComponent;
  let fixture: ComponentFixture<DomainCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
