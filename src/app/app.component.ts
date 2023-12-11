import { Component, OnInit, ViewChild } from '@angular/core';
import { AppHeaderService } from './services/app-header.service';
import { HeaderConfig } from './appConstants';
import { TranslateService } from '@ngx-translate/core';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  headerConfig!: HeaderConfig;
  @ViewChild('mainContent', { read: IonRouterOutlet, static: false }) routerOutlet!: IonRouterOutlet;
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

  async menuItemAction(menuName: string) {
    switch (menuName) {
      case "All":
        
        break;
      case "Make a Story":
        
        break;
      case "Ask a doubt":
        
        break;
      case "Parents":
        
        break;
      case "Teachers":
        
        break;
      case "Divyang":
        
        break;
      case "Tribal":
        
        break;
      case "Lullabies":
        
        break;
      case "Games":
        
        break;
      default:
        break;
    }
  }
}
