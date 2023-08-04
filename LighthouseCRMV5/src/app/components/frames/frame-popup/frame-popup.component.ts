import { Component, OnInit } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-frame-popup',
  templateUrl: './frame-popup.component.html',
  styleUrls: ['./frame-popup.component.scss'],
})
export class FramePopupComponent implements OnInit {
  modal: any;
  constructor(private globalObjects: GlobalObjectsService) { }

  ngOnInit() {
    this.modal = document.getElementById("myModal");
    if (this.globalObjects.framePopup) {
      this.modal.style.display = "block";
      this.globalObjects.framePopup = false;
    } else {
      this.modal.style.display = "none";
    }

    window.onclick = (event) => {
      if (event.target == this.modal) {
        this.modal.style.display = "none";
      }
    }
  }

  closeModal() {
    this.modal.style.display = "none";
  }

}
