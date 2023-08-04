import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameCartSummaryPlainComponent } from './frame-cart-summary-plain.component';

describe('FrameCartSummaryPlainComponent', () => {
  let component: FrameCartSummaryPlainComponent;
  let fixture: ComponentFixture<FrameCartSummaryPlainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameCartSummaryPlainComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameCartSummaryPlainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
