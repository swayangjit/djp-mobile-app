import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../app/services';
import { AppHeaderService } from '../../../app/services/app-header.service';

@Component({
  selector: 'app-mypitara',
  templateUrl: 'mypitara.page.html',
  styleUrls: ['mypitara.page.scss']
})
export class MyPitaraPage implements OnInit{

  constructor(private headerService: AppHeaderService, 
    private utilService: UtilService) {}
  
  ngOnInit() {
  }

  ionViewWillEnter()  {
    this.headerService.showHeader(this.utilService.translateMessage("My Pitara"));
  }

}
