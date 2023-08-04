import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSummaryPage } from './cart-summary.page';

describe('CartSummaryPage', () => {
  let component: CartSummaryPage;
  let fixture: ComponentFixture<CartSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartSummaryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
