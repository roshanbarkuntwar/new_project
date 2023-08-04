import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameSingleScaleColumnChartComponent } from './frame-single-scale-column-chart.component';

describe('FrameSingleScaleColumnChartComponent', () => {
  let component: FrameSingleScaleColumnChartComponent;
  let fixture: ComponentFixture<FrameSingleScaleColumnChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameSingleScaleColumnChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameSingleScaleColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
