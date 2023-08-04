import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaTextComponent } from './para-text.component';

describe('ParaTextComponent', () => {
  let component: ParaTextComponent;
  let fixture: ComponentFixture<ParaTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParaTextComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParaTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
