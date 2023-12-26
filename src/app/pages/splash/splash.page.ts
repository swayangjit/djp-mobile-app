import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, AppHeaderService, CachingService, ConfigService, UtilService } from '../../../app/services';
import { AppInitializeService } from '../../../app/services/appInitialize.service';
import { StorageService } from '../../../app/services/storage.service';
import { v4 as uuidv4 } from "uuid";
import { TelemetryGeneratorService } from 'src/app/services/telemetry/telemetry.generator.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiModule } from 'src/app/services/api/api.module';

@Component({
  selector: 'app-splash',
  templateUrl: 'splash.page.html',
  styleUrls: ['splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(private appinitialise: AppInitializeService,
    private storage: StorageService,
    private router: Router,
    private headerService: AppHeaderService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private utilService: UtilService,
    private cachingService: CachingService,
    private configService: ConfigService,
    private translate: TranslateService,
    private apiService: ApiService) {
      this.cachingService.initStorage();
    }
    
  async ngOnInit() {
    this.headerService.showStatusBar(true);
    this.headerService.hideHeader();
    ApiModule.getInstance().init(await this.utilService.getDeviceId())
    this.apiService.onInit().subscribe();
    let sid = uuidv4();
    this.storage.setData("sid", sid);
    setTimeout(async () => {
      console.log('route');
      this.startTelemetry()
      this.router.navigate(['/tabs/home']);
    }, 2000);
    this.appinitialise.initialize();
    let config = await this.configService.getConfigMeta();
    this.storage.setData('configMeta', JSON.stringify(config));
    let lang = await this.storage.getData('lang')
    if(lang) {
      this.translate.use(lang);
    } else {
      config.languages.forEach(lang => {
        if (lang?.default) {
          this.translate.setDefaultLang(lang.id)
          this.translate.use(lang.id);
        }
      })
    }
  }

  async startTelemetry(): Promise<void> {
    this.telemetryGeneratorService.genererateAppStartTelemetry(await this.utilService.getDeviceSpec());
  }
} 
