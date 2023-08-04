import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FramePlastoSummaryCardComponent } from './frame-plasto-summary-card.component';

describe('FramePlastoSummaryCardComponent', () => {
  let component: FramePlastoSummaryCardComponent;
  let fixture: ComponentFixture<FramePlastoSummaryCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FramePlastoSummaryCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FramePlastoSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
