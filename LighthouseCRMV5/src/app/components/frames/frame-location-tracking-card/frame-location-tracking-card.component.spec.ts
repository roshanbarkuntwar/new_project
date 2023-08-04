import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameLocationTrackingCardComponent } from './frame-location-tracking-card.component';

describe('FrameLocationTrackingCardComponent', () => {
  let component: FrameLocationTrackingCardComponent;
  let fixture: ComponentFixture<FrameLocationTrackingCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameLocationTrackingCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameLocationTrackingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
