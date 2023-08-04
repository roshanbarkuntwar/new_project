import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ion-badges',
  templateUrl: './ion-badges.component.html',
  styleUrls: ['./ion-badges.component.scss'],
})
export class IonBadgesComponent implements OnInit {
  @Input() labelInput: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    if (this.labelInput.value) {
      this.labelInput.value = this.labelInput.value.split('@');
    }
  }

  itemClicked() {
    this.emitPass.emit(this.labelInput);
  }


}
