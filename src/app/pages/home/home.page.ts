import { Component, OnInit } from '@angular/core';
import { AppHeaderService, UtilService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  constructor(
    private headerService: AppHeaderService,
    private utilService: UtilService) {}
    
  async ngOnInit(): Promise<void> {
    this.headerService.showHeader(this.utilService.translateMessage('Jaadui Pitara'));
  }
}
