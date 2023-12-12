import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderService, CachingService, TelemetryService, UtilService } from '../../../app/services';
import { AppInitializeService } from '../../../app/services/appInitialize.service';
import { StorageService } from '../../../app/services/storage.service';
import { startTelemetryConfig } from '../../../app/services/telemetry/telemetryConstants';
import { v4 as uuidv4 } from "uuid";
import { TelemetryGeneratorService } from 'src/app/services/telemetry/telemetry.generator.service';

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
    private cachingService: CachingService) {
      this.cachingService.initStorage();
    }
    
  async ngOnInit() {
    this.headerService.showStatusBar();
    this.headerService.hideHeader();
    setTimeout(async () => {
      this.startTelemetry()
      this.router.navigate(['/tabs/home']);
    }, 2000);
    let sid = uuidv4();
    this.storage.setData("sid", sid);
    this.appinitialise.initialize();
  }

  async startTelemetry(): Promise<void> {
    this.telemetryGeneratorService.genererateAppStartTelemetry(await this.utilService.getDeviceSpec());
  }
} 
