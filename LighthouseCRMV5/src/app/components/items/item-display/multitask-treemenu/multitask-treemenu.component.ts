import { Component, Input, OnInit } from '@angular/core';
import { Events } from 'src/app/demo-utils/event/events';
import { collapse } from './../../../animation/collapse-animate';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-multitask-treemenu',
  templateUrl: './multitask-treemenu.component.html',
  styleUrls: ['./multitask-treemenu.component.scss'],
  animations: [collapse]
})
export class MultitaskTreemenuComponent implements OnInit {
  @Input() model: any;
  @Input() isChild: boolean;
  @Input() isMainFolder: boolean;
  @Input() isFile: any;
  @Input() itemData: any;
  l_url: any;

  productsofTree: any = {

    folderName: "Tree Menu",
    folders: [{

      folderName: "A",
      folders: [{

        folderName: "Option 1",
        folders: []
      }, {

        folderName: "Option 2",
        folders: [{

          folderName: "Projector 4",
          folders: []
        }]
      }],

    }, {

      folderName: "B",
      folders: [{

        folderName: "Option 1",
        folders: []
      }, {

        folderName: "Option 2",
        folders: [{

          folderName: "Option 3",
          folders: []
        }]
      }],

    },
    {

      folderName: "C",
      folders: [{
        files: [{
          fileName: "Option 1"
        }],
        folderName: "Option 2",
        folders: []
      }, {

        folderName: "Option 3",
        folders: [{

          folderName: "Option 4",
          folders: []
        }]
      }],

    }]
  }

  constructor(private dataService: DataService, public events: Events) {

  }

  ngOnInit() {
    setTimeout(() => {
      if (this.isMainFolder) {
        this.getData();
        console.log("treeset")
        this.isMainFolder = false;
      } else {
        this.model.forEach((element: any) => {
          element.isSelect ? element.toggle = 'on' : element.toggle = 'init';
        });
      }
    }, 100)

  }

  private toggleItem(item) {
    item.toggle === 'on' ? item.toggle = 'off' : item.toggle = 'on';
  }

  getData() {
    this.model = [];
    this.model.push(this.productsofTree);
    console.log(this.model);
    this.model.forEach((element: any) => {
      element.isSelect ? element.toggle = 'on' : element.toggle = 'init';

    });
    console.log(this.model);
  }


  DownloadandOpenPdf(filename, i) {
    console.log("it s", JSON.stringify(filename))
  }


}
