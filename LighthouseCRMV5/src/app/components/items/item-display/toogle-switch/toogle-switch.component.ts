import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toogle-switch',
  templateUrl: './toogle-switch.component.html',
  styleUrls: ['./toogle-switch.component.scss'],
})
export class ToogleSwitchComponent implements OnInit {
  @Input() toggle: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  toggleMode = false;
  constructor() { }

  ngOnInit() {
    if (this.toggle.value) {
      if (this.toggle.value.toUpperCase() === 'Y') {
        this.toggleMode = true;
      } else {
        this.toggleMode = false;
      }
    }
  }

  itemClick(mode) {
    if (mode) {
      this.toggle.value = "Y";
      this.toggle.item_default_value = "";
      this.emitPass.emit(this.toggle);
    } else {
      this.toggle.value = "N";
      this.toggle.item_default_value = "";
      this.emitPass.emit(this.toggle);
    }
  }

}
