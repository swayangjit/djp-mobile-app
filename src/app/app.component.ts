import { Component, OnInit } from '@angular/core';
import { AppInitializeService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(
    private appinitialise: AppInitializeService) {
      this.appinitialise.initialize();
  }

  async ngOnInit() {
  }
}
