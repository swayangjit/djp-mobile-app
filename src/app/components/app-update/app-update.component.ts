import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-app-update',
  templateUrl: './app-update.component.html',
  styleUrls: ['./app-update.component.scss'],
})
export class AppUpdateComponent  implements OnInit {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {}

  handleButtonAction(action: string) {
    this.popoverCtrl.dismiss(action)
  }

}
