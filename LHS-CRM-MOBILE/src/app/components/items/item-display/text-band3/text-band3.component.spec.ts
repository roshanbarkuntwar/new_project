import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBand3Component } from './text-band3.component';

describe('TextBand3Component', () => {
  let component: TextBand3Component;
  let fixture: ComponentFixture<TextBand3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextBand3Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBand3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
