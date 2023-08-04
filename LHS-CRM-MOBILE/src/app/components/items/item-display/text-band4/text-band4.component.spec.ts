import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBand4Component } from './text-band4.component';

describe('TextBand4Component', () => {
  let component: TextBand4Component;
  let fixture: ComponentFixture<TextBand4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextBand4Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBand4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
