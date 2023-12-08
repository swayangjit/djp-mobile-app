import { Component, OnInit } from '@angular/core';
import { AppHeaderService } from './services/app-header.service';
import { HeaderConfig } from './appConstants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  headerConfig!: HeaderConfig;
  constructor(private headerService: AppHeaderService) {
  }

  async ngOnInit() {
    this.headerService.headerConfigEmitted$.subscribe((config: HeaderConfig) => {
      this.headerConfig = config;
    });
  }
}
