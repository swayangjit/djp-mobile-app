import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderService, TelemetryService, UtilService } from 'src/app/services';
import { AppInitializeService } from 'src/app/services/appInitialize.service';
import { StorageService } from 'src/app/services/storage.service';
import { startTelemetryConfig } from 'src/app/services/telemetry/telemetryConstants';
import { v4 as uuidv4 } from "uuid";

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
    private telemetryService: TelemetryService,
    private utilService: UtilService) {}
    
  async ngOnInit() {
    this.headerService.hideStatusBar();
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
    let info = await this.utilService.getAppInfo();
    let startConfig = startTelemetryConfig;
    startConfig.edata = { type: "app"};
    startConfig.context.did = await this.utilService.getDeviceId();
    startConfig.context.sid = await this.storage.getData('sid');
    startConfig.context.env = 'splash';
    startConfig.context.pdata = {"id": info.id, "pid": info.name, "ver": info.version};
    startConfig.actor = {type: 'User', id: ''}
    this.telemetryService.raiseStartTelemetry(startConfig)
  }
} 
