import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-chat-right',
  templateUrl: './chat-right.component.html',
  styleUrls: ['./chat-right.component.scss'],
})
export class ChatRightComponent implements OnInit {
  @Input() chatrightinput: any;
  @Input() frame_type: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();

  current_page_parameter: any = {};
  constructor(private globalObjects: GlobalObjectsService) { }

  ngOnInit() {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
  }

  onChange(onChange) {
    this.emitOnChange.emit(this.chatrightinput)
  }

  getParsedJson(json) {
    try {
      if (json) {
        return JSON.parse(json)
      } else {
        return {}
      }
    } catch (err) {
      if (typeof json == 'object') {
        return json;
      } else {
        return {}
      }
    }
  }

}
