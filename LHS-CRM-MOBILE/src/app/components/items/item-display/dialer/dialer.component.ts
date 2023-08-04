import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-dialer-input',
  templateUrl: './dialer.component.html',
  styleUrls: ['./dialer.component.scss'],
})
export class DialerComponent implements OnInit {
  @Input() dialer : any;
  @Input() frame_type:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};

  constructor(private globalObjects: GlobalObjectsService ) { 
    this.current_page_parameter = this.globalObjects.current_page_parameter;
  }

  ngOnInit() {
  }
  
  itemClick(event) {
    this.emitPass.emit(this.dialer);
  }
}

