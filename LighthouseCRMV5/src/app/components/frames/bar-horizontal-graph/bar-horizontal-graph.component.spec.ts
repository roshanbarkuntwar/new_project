import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarHorizontalGraphComponent } from './bar-horizontal-graph.component';

describe('BarHorizontalGraphComponent', () => {
  let component: BarHorizontalGraphComponent;
  let fixture: ComponentFixture<BarHorizontalGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BarHorizontalGraphComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BarHorizontalGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
