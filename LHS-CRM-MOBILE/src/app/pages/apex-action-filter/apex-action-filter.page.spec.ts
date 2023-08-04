import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexActionFilterPage } from './apex-action-filter.page';

describe('ApexActionFilterPage', () => {
  let component: ApexActionFilterPage;
  let fixture: ComponentFixture<ApexActionFilterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApexActionFilterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApexActionFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
