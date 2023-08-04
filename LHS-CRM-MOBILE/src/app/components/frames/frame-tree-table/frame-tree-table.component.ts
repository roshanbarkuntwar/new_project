import { HttpClient } from '@angular/common/http';
import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';
////import { TreeNode } from 'primeng/components/common/treenode';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { cloneDeep } from 'lodash';
import { TreeNode } from 'primeng/components/common/treenode';

@Component({
  selector: 'app-frame-tree-table',
  templateUrl: './frame-tree-table.component.html',
  styleUrls: ['./frame-tree-table.component.scss'],
})
export class FrameTreeTableComponent implements OnInit {
 
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  wscp = {}
  userDetails:any;


  files: TreeNode[] = [];
  level:any=0;
  cols: any[] = [];
  frozenCols: any[] = [];
  scrollableCols:any[]=[];
  flag:boolean = true;


  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService,private lhs_lib : LhsLibService, private http: HttpClient) { }

  ngOnInit() {

    this.cols = [
      { field: 'CHILD_CODE', header: 'Item Code' },
      { field: 'CHILD_NAME', header: 'Item Name' },
   
      { field: 'COL1', header: 'COL1' },
      { field: 'COL2', header: 'COL2' },
      { field: 'COL3', header: 'COL3' },
      { field: 'COL4', header: 'COL4' },
      { field: 'COL5', header: 'COL5' },
      { field: 'COL6', header: 'COL6' },
      { field: 'COL7', header: 'COL7' },
      { field: 'COL8', header: 'COL8' },
      { field: 'OTHER_COL1', header: 'Other Col1' },
      { field: 'OTHER_COL2', header: 'Other Col2' },
      { field: 'OTHER_COL3', header: 'Other Col3' },
      { field: 'OTHER_COL4', header: 'Other Col4' },
      { field: 'OTHER_COL5', header: 'Other Col5' },
      { field: 'OTHER_COL6', header: 'Other Col6' }
    ];

    this.getJSON().subscribe((data: any) => {
      //console.log(data.data);
     
      let res = data.data.map((d: any) => {
       
        const getSum = (obj: { [x: string]: any; CHILD_CODE: any; }, prop: string) => {
          let count=0;
          //console.log("x--"+obj.x);
          const children = data.data.filter(({ PARENT_CODE }:any) => PARENT_CODE === obj.CHILD_CODE)
         // count = children.length;
          if (children.length === 0) return obj[prop]
          return children.reduce((acc: string, c: { [x: string]: any; CHILD_CODE: any; }) => parseFloat(acc) + parseFloat(getSum(c, prop))
          
          , 0)+"#"+children.length
        }
        
        if (this.cols && this.cols.length > 0) {
          for (let i = 0; i < this.cols.length; i++) {
            if (this.cols[i].field.startsWith("COL")) {
              let result = getSum(d, this.cols[i].field).split("#");
              d[this.cols[i].field] = Math.round(parseFloat(result[0]));
              d["COUNT1"] = parseInt(result[1]);
            }
          }
        }
         
  
        return {
          ...d
          //COL1: parseFloat(getSum(d, "COL1")),
         // COL2: parseFloat(getSum(d, "COL2")),
         // COL3: parseFloat(getSum(d, "COL3")),
         // COL4: parseFloat(getSum(d, "COL4")),
         // COL5: parseFloat(getSum(d, "COL5")),
         // COL6: parseFloat(getSum(d, "COL6")),
         // COL7: parseFloat(getSum(d, "COL7")),
         // COL8: parseFloat(getSum(d, "COL8")),
        }
      })
  
      
      
  
  
  
      
      this.files = this.convertToHierarchy(res);
  
     // this.files = this.removeEmpty(this.files,null,null);
  
      
     //this.files= this.postOrder(d);
  
      //console.log("JSON--->"+JSON.stringify(this.files));
  },(err)=> console.log(err));
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/tableNew.json");
}

  convertToHierarchy(arry: string | any[]) {
    ///  var arry = [{ "Id": "1", "Name": "abc", "Parent": "", "attr": "abc", "amount": "12" },
     // { "Id": "2", "Name": "abc", "Parent": "1", "attr": "abc", "amount": "3" },
     // { "Id": "3", "Name": "abc", "Parent": "2", "attr": "abc", "amount": "4" },
     // { "Id": "4", "Name": "abc", "Parent": "2", "attr": "abc", "amount": "5" }];
      var nodeObjects = this.createStructure(arry);
      for (var i = nodeObjects.length - 1; i >= 0; i--) {
        var currentNode = nodeObjects[i];
        if (currentNode.data.PARENT_CODE === "") {
          continue;
        }
        var PARENT_CODE = this.getParent(currentNode, nodeObjects);
  
        if (PARENT_CODE === null) {
          continue;
        }
  
        PARENT_CODE.children.push(currentNode);
        nodeObjects.splice(i, 1);
      }
      console.dir(nodeObjects);
      return nodeObjects;
    }
    createStructure(nodes: string | any[]) {
      var objects = [];
  
      for (var i = 0; i < nodes.length; i++) {
        objects.push({ data: nodes[i], children: [] });
      }
  
      return objects;
  
    }
    getParent(child: { data: any; children?: never[]; }, nodes: string | any[]) {
      var PARENT_CODE = null;
  
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].data.CHILD_CODE === child.data.PARENT_CODE) {
          return nodes[i];
        }
      }
  
      return PARENT_CODE;
    }
    postOrder(root:any) {
      if (root.children) {
        root.children.forEach((child: any) => {
          root.DRAMT += this.postOrder(child);
        });
      }
    
      root.DRAMT = root.DRAMT + root.DRAMT;
      return root;
    }

  

  getData() {
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_working_mode = this.wscp_send_input.apps_working_mode;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.orignal_apps_item_seqid = this.wscp_send_input.orignal_apps_item_seqid;
    wscp.origin_apps_item_seqid = this.wscp_send_input.origin_apps_item_seqid;
    this.wscp = wscp;
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    let wsdp 
    if(wscp.service_type == "execute_query"){

      wsdp = this.globalObjects.getWsdp("").wsdp;
    }else{
      wsdp = this.wsdp;
    }

    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
      "wsdpcl": this.wsdpcl
    }

    let l_url = "S2U";
    let tableData: any;

    

      this.dataService.postData(l_url, reqData).then(res => {
        let data: any = res;

        if (data.responseStatus == "success") {
          let tableRows = [];
          let objData = this.globalObjects.setPageInfo(data.responseData);

          // Developer Mode Loging
          // let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
          // let wsSewId = id ? data.responseData.Values[0][id] : "";
          // this.developerModeData = {
          //   ws_seq_id: wsSewId,
          //   frame_seq_id: reqData.wscp.apps_page_frame_seqid
          // }
          //Developer Mode Loging

            console.log("Frame Tree Table Data", objData)
          
        }
      
      }).catch(err => {
      
        // this.showFrame = true;
        this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
     
      })
    

  }

  collapseNodes(nodes: any) {
    for (let node of nodes) {
      node.expanded = false;
    }
  }
  expandNodes(nodes: any) {
    for (let node of nodes) {
      node.expanded = true;
    }
  }
  onExpandOneLevel() {
    console.log(this.files);
    if (this.level === 0) {
      this.expandNodes(this.files);
    }
    // else {
    //   this.traverse(
    //     this.files,
    //     (o, prop, value) => {
    //       if (prop === "children") {
    //         this.expandNodes(value);
    //       }
    //     },
    //     this.level
    //   );
    // }

    //this.level++;
    for (var i = 0, arr2 = Array(this.files.length); i < this.files.length; i++) {
      arr2[i] = this.files[i];
    }
    this.files =arr2;
    // this.files = [...this.files];
  }

  onCollapseOneLevel() {
    //console.log(this.files);
    //this.level--;

    if (this.level === 0) {
      this.collapseNodes(this.files);
    }
   //  else {
     // this.traverse(
      //  this.files,
      //  (o, prop, value) => {
       ////   if (prop === "children") {
     //       this.collapseNodes(value);
         // }
    //    },
    //    this.level
     // );
   // }
   for (var i = 0, arr2 = Array(this.files.length); i < this.files.length; i++) {
    arr2[i] = this.files[i];
  }
  this.files =arr2;
    // this.files = [...this.files];
  }

  public expandAll(): void {
    const temp = cloneDeep(this.files);
    temp.forEach((node: TreeNode) => {
      this.expandCollapseRecursive(node, true);
    });
    this.files = temp;
  }

  public collapseAll(): void {
    const temp = cloneDeep(this.files);
    temp.forEach(node => {
      this.expandCollapseRecursive(node, false);
    });
    this.files = temp;
  }

  private expandCollapseRecursive(node: TreeNode, isExpand: boolean): void {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandCollapseRecursive(childNode, isExpand);
      });
    }
  }
  toObject(names: any, values: any) {
    var result = new Array;
    for (var i = 0; i < names.length; i++)
      result[names[i]] = values[i];
    return result;
  }
}
