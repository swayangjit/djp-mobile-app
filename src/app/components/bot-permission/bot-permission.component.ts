import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { StorageService } from 'src/app/services';

@Component({
  selector: 'app-bot-permission',
  templateUrl: './bot-permission.component.html',
  styleUrls: ['./bot-permission.component.scss'],
})
export class BotPermissionComponent  implements OnInit {
  botType = '';
  botPremission: any = false;
  constructor(
    private router: Router,
    private modal: ModalController,
    private storage: StorageService,
    private navParams: NavParams
  ) { }
  
  async ngOnInit() {
    this.botType = this.navParams.get('type')
  }
  
  async handleClick(type: string) {
    if(type == 'accept') {
      await this.storage.setData(this.botType, 'true')
    }
    this.modal.dismiss({type});
  }
}
