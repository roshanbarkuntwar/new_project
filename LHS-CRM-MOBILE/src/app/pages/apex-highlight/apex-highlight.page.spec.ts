import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexHighlightPage } from './apex-highlight.page';

describe('ApexHighlightPage', () => {
  let component: ApexHighlightPage;
  let fixture: ComponentFixture<ApexHighlightPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApexHighlightPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApexHighlightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
