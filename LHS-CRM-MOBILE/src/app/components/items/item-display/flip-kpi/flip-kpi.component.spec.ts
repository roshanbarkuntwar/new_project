import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlipKpiComponent } from './flip-kpi.component';

describe('FlipKpiComponent', () => {
  let component: FlipKpiComponent;
  let fixture: ComponentFixture<FlipKpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlipKpiComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlipKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
