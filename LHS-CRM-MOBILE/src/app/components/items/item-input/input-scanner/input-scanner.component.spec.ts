import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputScannerComponent } from './input-scanner.component';

describe('InputScannerComponent', () => {
  let component: InputScannerComponent;
  let fixture: ComponentFixture<InputScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputScannerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
