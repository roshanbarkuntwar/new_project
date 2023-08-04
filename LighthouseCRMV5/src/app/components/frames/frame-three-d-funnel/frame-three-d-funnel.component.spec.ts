import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameThreeDFunnelComponent } from './frame-three-d-funnel.component';

describe('FrameThreeDFunnelComponent', () => {
  let component: FrameThreeDFunnelComponent;
  let fixture: ComponentFixture<FrameThreeDFunnelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameThreeDFunnelComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameThreeDFunnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
