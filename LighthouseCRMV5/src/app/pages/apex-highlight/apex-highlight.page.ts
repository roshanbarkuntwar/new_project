import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-apex-highlight',
  templateUrl: './apex-highlight.page.html',
  styleUrls: ['./apex-highlight.page.scss'],
})
export class ApexHighlightPage implements OnInit  {

  @Input() frame:any = {};
  public toggle: boolean = false;

  public rgbaText: string = 'rgba(165, 26, 214, 0.2)';

  apexThead = [];

public colorList = [
    {key: "default", value: "", friendlyName: "default" },
    {key: "flame", value: "#e45a33", friendlyName: "Flame" },
    {key: "orange", value: "#fa761e", friendlyName: "Orange" },
    {key: "infrared",     value: "#ef486e", friendlyName: "Infrared" },
    {key: "male",       value: "#4488ff", friendlyName: "Male Color" },
    {key: "female",     value: "#ff44aa", friendlyName: "Female Color" },
    {key: "paleyellow",    value: "#ffd165", friendlyName: "Pale Yellow" },
    {key: "gargoylegas",  value: "#fde84e", friendlyName: "Gargoyle Gas" },
    {key: "androidgreen",   value: "#9ac53e", friendlyName: "Android Green" },
    {key: "carribeangreen",    value: "#05d59e", friendlyName: "Carribean Green" },
    {key: "bluejeans",    value: "#5bbfea", friendlyName: "Blue Jeans" },
		{key: "cyancornflower",    value: "#1089b1", friendlyName: "Cyan Cornflower" },
		{key: "warmblack",    value: "#06394a", friendlyName: "Warm Black" },
];


lightColors = [
  {class:'c1', value:'#f3dabd'},
  {class:'c2', value:'#42ff9f'},
  {class:'c3', value:'#95d7f7'},
  {class:'c4', value:'#f795dd'},
  {class:'c5', value:'#f7cb95'},
  {class:'c6', value:'#ccc'},
  {class:'c7', value:'#000000'},
  {class:'c8', value:'#ffffff'}
]

darkColor = [
  {class:'c9', value:'#8a6207'},
  {class:'c10', value:'#800080'},
  {class:'c11', value:'#ffa500'},
  {class:'c12', value:'#008000'},
  {class:'c13', value:'#ff0000'},
  {class:'c14', value:'#0000ff'},
  {class:'c15', value:'#ddd'},
  {class:'c16', value:'#000000'},
  {class:'c8', value:'#ffffff'}
]

fontColor = "#000000";
backColor = "#ffffff";

selectedFontCol = "";
selectedBackCol = "";
  public presetValues : string[] = [];

  public selectedColor: string = 'color1';


  operators: any = ['==', '!=', 'is null', 'is not null', 'like', 'not like', 'in', 'not in'];
  operator = "==";
  expression;
  coloumns;

  constructor(public vcRef: ViewContainerRef,public popOverCtrl: PopoverController) {

    this.presetValues = this.getColorValues();
  }
  ngOnInit() {
    this.apexThead = this.frame.apextheaders;
  }

  getColorValues(){
  return this.colorList.map(c => c.value);
  }


  public onEventLog(event: string, data: any): void {
    console.log(event, data);
  }

  public onChangeColorCmyk(color: string) {
    // const hsva = this.cpService.stringToHsva(color);

    // if (hsva) {
    //   const rgba = this.cpService.hsvaToRgba(hsva);

    //   return this.cpService.rgbaToCmyk(rgba);
    // }

    // return new Cmyk(0, 0, 0, 0);
  }

  public onChangeColorHex8(color: string): string {
    // const hsva = this.cpService.stringToHsva(color, true);

    // if (hsva) {
    //   return this.cpService.outputFormat(hsva, 'rgba', null);
    // }

    return '';
  }

  changeBackColor(val){
    this.backColor = val;
    this.selectedBackCol = val;
  }

  changeTextColor(val){
    this.fontColor = val;
    this.selectedFontCol = val;
  }

  backColorSelected(val){
    this.backColor = val;
    this.selectedBackCol = val;
  }

  fontColorSelected(val){
    this.fontColor = val;
    this.selectedFontCol = val;
  }

  closePop(){
    this.popOverCtrl.dismiss('','cancel');
  }

  createCondition(){
    let cond = {
      itmname: this.coloumns.item_name,
      operator : this.operator,
      value: this.expression
    }
    let con = {
      condition: cond,
      style:{
        'background-color':this.backColor,
        'color':this.fontColor
      }
    }

    this.popOverCtrl.dismiss(con,'data');
  }
}
