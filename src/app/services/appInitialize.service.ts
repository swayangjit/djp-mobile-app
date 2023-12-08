import { Injectable } from '@angular/core';
import { DbService } from './db/db.service';
import { TelemetryService } from './telemetry/telemetry.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializeService {
  constructor(
    private dbService: DbService,
    private telemetryService: TelemetryService
  ) { }

  async initialize() {
    await this.dbService.initializePlugin();
    await this.telemetryService.initializeTelemetry();
  }
}
