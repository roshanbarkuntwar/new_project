import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBand2Component } from './text-band2.component';

describe('TextBand2Component', () => {
  let component: TextBand2Component;
  let fixture: ComponentFixture<TextBand2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextBand2Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBand2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
