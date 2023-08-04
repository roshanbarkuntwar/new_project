import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-frame-footer',
  templateUrl: './frame-footer.component.html',
  styleUrls: ['./frame-footer.component.scss'],
})
export class FrameFooterComponent implements OnInit {

  @Input() item: any = {};
  @Input() frame_type: any = {};
  @Input() frame: any = {};
  @Input() wscp: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  itemClicked(event) {
    this.emitPass.emit(event);
  }

}
