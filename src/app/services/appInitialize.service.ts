import { Injectable } from '@angular/core';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializeService {
  constructor(
    private dbService: DbService
  ) { }

  async initialize() {
    console.log('initialise');
    await this.dbService.initializePlugin();
  }
}
