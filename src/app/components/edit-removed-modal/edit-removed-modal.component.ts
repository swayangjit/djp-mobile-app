import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-removed-modal',
  templateUrl: './edit-removed-modal.component.html',
  styleUrls: ['./edit-removed-modal.component.scss'],
})
export class EditRemovedModalComponent  implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  confirm(event: any) {
    switch (event) {
      case 'edit':
        this.modalCtrl.dismiss({type: 'edit'})
        break;
      case 'delete':
       this.modalCtrl.dismiss({type: 'delete'})
        break;
      default:
        break;
    }
  }

}
