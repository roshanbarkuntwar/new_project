import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { frameCollapsComponent } from './frame-collaps.component';


describe('FrameCollapsComponent', () => {
  let component: frameCollapsComponent;
  let fixture: ComponentFixture<frameCollapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ frameCollapsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(frameCollapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
