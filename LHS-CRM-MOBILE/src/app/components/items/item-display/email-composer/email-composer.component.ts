import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-email-composer',
  templateUrl: './email-composer.component.html',
  styleUrls: ['./email-composer.component.scss'],
})
export class EmailComposerComponent implements OnInit {
  @Input() email : any;
  @Input() frame_type:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {}

  itemClick(event) {
    this.emitPass.emit(this.email);
  }
}
