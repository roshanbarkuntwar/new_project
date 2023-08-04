import { Component, Input, OnInit } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-partition-item',
  templateUrl: './partition-item.component.html',
  styleUrls: ['./partition-item.component.scss'],
})
export class PartitionItemComponent implements OnInit {
  @Input() separator:any;
  constructor(public globalObjects:GlobalObjectsService) { }

  ngOnInit() {}

}
