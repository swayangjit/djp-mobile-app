import { Component } from '@angular/core';
import { UtilService } from 'src/app/services';
import { AppHeaderService } from 'src/app/services/app-header.service';

@Component({
  selector: 'app-mypitara',
  templateUrl: 'mypitara.page.html',
  styleUrls: ['mypitara.page.scss']
})
export class MyPitaraPage {

  constructor(private headerService: AppHeaderService, 
    private utilService: UtilService) {
    this.headerService.showHeader(this.utilService.translateMessage("My Pitara"));
  }

}
