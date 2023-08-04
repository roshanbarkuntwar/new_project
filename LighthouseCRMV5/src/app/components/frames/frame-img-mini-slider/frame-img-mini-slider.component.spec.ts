import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameImgMiniSliderComponent } from './frame-img-mini-slider.component';

describe('FrameImgMiniSliderComponent', () => {
  let component: FrameImgMiniSliderComponent;
  let fixture: ComponentFixture<FrameImgMiniSliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameImgMiniSliderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameImgMiniSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
