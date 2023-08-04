import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperPage } from './super.page';

describe('SuperPage', () => {
  let component: SuperPage;
  let fixture: ComponentFixture<SuperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
