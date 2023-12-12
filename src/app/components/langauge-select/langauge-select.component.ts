import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-langauge-select',
  templateUrl: './langauge-select.component.html',
  styleUrls: ['./langauge-select.component.scss'],
})
export class LangaugeSelectComponent  implements OnInit {
  selectedLanguage: string = "";
  languages!: Array<any>;
  constructor(private translateService: TranslateService,
    private navParams: NavParams,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.languages = [];
    this.languages = this.navParams.get('languages');
    let currentLang = this.translateService.currentLang;
    console.log('current lang ', currentLang);
    this.selectedLanguage = currentLang;
  }

  languageSelected(ev: any) {
    let val = ev.detail.value;
    console.log('Current value:', JSON.stringify(val));
    this.translateService.use(val);
    this.selectedLanguage = val;
    let res = this.translateService.instant('Title')
    console.log(res);
    this.dismissModal();
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
