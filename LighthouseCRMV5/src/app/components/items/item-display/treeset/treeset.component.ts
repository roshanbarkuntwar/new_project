import { Component, OnInit, Input } from '@angular/core';
import { collapse } from './../../../animation/collapse-animate';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/demo-utils/event/events';
@Component({
  selector: 'app-treeset',
  templateUrl: './treeset.component.html',
  styleUrls: ['./treeset.component.scss'],
  animations: [collapse]
})
export class TreesetComponent implements OnInit {

  @Input() model: any;
  @Input() isChild: boolean;
  @Input() isMainFolder: any;
  @Input() isFile: any;
  @Input() itemData: any;
  l_url: any;
  productsofTree: any = {

    folderName: "Projectors",
    folders: [{

      folderName: "Projector1",
      folders: [{

        folderName: "Projector 2",
        folders: []
      }, {

        folderName: "Projector 3",
        folders: [{

          folderName: "Projector 4",
          folders: []
        }]
      }],

    }, {

      folderName: "Projector1",
      folders: [{

        folderName: "Projector 2",
        folders: []
      }, {

        folderName: "Projector 3",
        folders: [{

          folderName: "Projector 4",
          folders: []
        }]
      }],

    },
    {

      folderName: "Projector1",
      folders: [{
        files: [{
          fileName: "mywork"
        }],
        folderName: "Projector 2",
        folders: []
      }, {

        folderName: "Projector 3",
        folders: [{

          folderName: "Projector 4",
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
