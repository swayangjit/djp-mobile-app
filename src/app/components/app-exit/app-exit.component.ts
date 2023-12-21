import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-app-exit',
  templateUrl: './app-exit.component.html',
  styleUrls: ['./app-exit.component.scss'],
})
export class AppExitComponent  implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  confirm(event: any) {
    switch (event) {
      case 'exit':
        this.modalCtrl.dismiss(true)
        break;
      case 'cancel':
       this.modalCtrl.dismiss(false)
        break;
      default:
        break;
    }
  }
}
