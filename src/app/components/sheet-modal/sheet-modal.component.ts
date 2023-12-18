import { Component, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';
import { ModalController, NavParams } from '@ionic/angular';
import { Content } from 'src/app/appConstants';

@Component({
  selector: 'app-sheet-modal',
  templateUrl: './sheet-modal.component.html',
  styleUrls: ['./sheet-modal.component.scss'],
})
export class SheetModalComponent implements OnInit {
  selectedItem: string = "";
  content!: Content
  liked: boolean = false;
  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.content = this.navParams.get('content');
  }

  contentLiked(event: Event) {
    if(event) {
      this.content.liked = !this.content.liked;
      this.liked = !this.liked;
      this.modalCtrl.dismiss({type: 'like', content: this.content});
    }
  }

  async shareContent(event: Event) {
    if((await Share.canShare()).value) {
      Share.share({url: this.content.metaData.url});
    }
  }

  addContentToMyPitara(event: Event) {
    this.modalCtrl.dismiss({type: 'addToPitara', content: this.content});
  }

  handleItemSelected(ev: any) {
    let val = ev.detail.value;
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
