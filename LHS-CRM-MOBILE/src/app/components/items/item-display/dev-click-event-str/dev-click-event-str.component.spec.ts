import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevClickEventStrComponent } from './dev-click-event-str.component';

describe('DevClickEventStrComponent', () => {
  let component: DevClickEventStrComponent;
  let fixture: ComponentFixture<DevClickEventStrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevClickEventStrComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevClickEventStrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
