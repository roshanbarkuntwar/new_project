import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-barcode-input',
  templateUrl: './barcode-input.component.html',
  styleUrls: ['./barcode-input.component.scss'],
})

export class BarcodeInputComponent implements OnInit {
  @Input() barcodeinput: any = {};
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  public isToggled: boolean = false;

  constructor(private barScanner: BarcodeScanner,
    private globalObjects: GlobalObjectsService) {
  }

  ngOnInit() {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
  }

  onChange(onChange) {
      this.emitOnChange.emit(this.barcodeinput)
  }

  barcodescanner() {
    let options: BarcodeScannerOptions = {
      torchOn: false,
      showTorchButton: true,
      prompt: "Point the camera at the barcode"
    };
    this.barScanner.scan(options).then(barcodeData => {
      this.barcodeinput.value = barcodeData.text;
      this.barcodeinput.isValid = true;
      this.onChange('ionChange');
    }).catch(err => {

    });
  }

  notify() {
    this.barcodescanner();
    this.isToggled = !this.isToggled;
  }

  cleardata() {
    this.isToggled = false;
    this.barcodeinput.value = "";
  }
}