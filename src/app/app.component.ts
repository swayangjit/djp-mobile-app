import { Component, OnInit } from '@angular/core';
import { AppHeaderService } from './services/app-header.service';
import { HeaderConfig } from './appConstants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  headerConfig!: HeaderConfig;
  constructor(private headerService: AppHeaderService,
    private translate: TranslateService) {
  }

  async ngOnInit() {
    this.headerService.headerConfigEmitted$.subscribe((config: HeaderConfig) => {
      this.headerConfig = config;
    });

    this.translate.addLangs([ 'en', 'hi', 'te']);
  }

  async handleHeaderEvents($event: Event) {
    this.headerService.sidebarEvent($event);
  }
}
