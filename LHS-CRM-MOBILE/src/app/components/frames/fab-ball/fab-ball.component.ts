import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-fab-ball',
  templateUrl: './fab-ball.component.html',
  styleUrls: ['./fab-ball.component.scss'],
})
export class FabBallComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  tableRows:any = [];
  constructor(private dataService: DataService, private globalObject: GlobalObjectsService) { }

  ngOnInit() {
   // console.log(this.frame);
   this.tableRows = this.frame.Level4;
  }


  itemClicked(event) {
    event.wsdp = [];
    event.wsdpcl = [];
    
    this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
    event.wscp = this.wscp_send_input;
   // console.log(event);
   
    this.emitPass.emit(event);
  }

  
}
