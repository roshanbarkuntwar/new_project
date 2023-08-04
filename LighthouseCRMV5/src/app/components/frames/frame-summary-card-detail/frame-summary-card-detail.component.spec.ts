import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameSummaryCardDetailComponent } from './frame-summary-card-detail.component';

describe('FrameSummaryCardDetailComponent', () => {
  let component: FrameSummaryCardDetailComponent;
  let fixture: ComponentFixture<FrameSummaryCardDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameSummaryCardDetailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameSummaryCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
