import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LOVInputComponent } from './lov-input.component';

describe('LOVInputComponent', () => {
  let component: LOVInputComponent;
  let fixture: ComponentFixture<LOVInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LOVInputComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LOVInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
