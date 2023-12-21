import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StorageService } from './services/storage.service';
import { DbService } from './services/db/db.service';
import { AppInitializeService } from './services/appInitialize.service';
import { TelemetryService } from './services/telemetry/telemetry.service';
import { AppHeaderService } from './services/app-header.service';
import { UtilService } from './services/util.service';
import { ContentService } from './services/content/content.service';
import { PlaylistService } from './services/playlist/playlist.service';
import { ConfigService } from './services/config.service';
import { ApiService, BotApiService, RecordingService, SearchService } from './services';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx'
import { TelemetryAutoSyncService } from './services/telemetry/telemetry.auto.sync.service';
import { DikshaPreprocessorService, PreprocessorService, SunbirdPreprocessorService } from './services';
import { CachingService } from './services/caching.service';
import { TelemetryDecorator } from './services/telemetry/models/telemetry.decorator';
import { TelemetryGeneratorService } from './services/telemetry/telemetry.generator.service';
import { ScannerService } from './services/scan/scanner.service';
import { PermissionsService } from './services/scan/permissions.service';
import { TabsService } from './services/tabs.service';

export function translateHttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (translateHttpLoaderFactory),
          deps: [HttpClient]
      }
    }),
    ComponentsModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    StorageService,
    DbService,
    AppInitializeService,
    TelemetryService,
    TelemetryAutoSyncService,
    AppHeaderService,
    UtilService,
    ContentService,
    PlaylistService,
    ApiService,
    ConfigService,
    PreprocessorService,
    SunbirdPreprocessorService,
    DikshaPreprocessorService,
    CachingService,
    RecordingService,
    TelemetryDecorator,
    TelemetryGeneratorService,
    ScannerService,
    PermissionsService,
    Diagnostic,
    SearchService,
    TabsService,
    BotApiService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {
  constructor(private translate: TranslateService) {
    // this.setDefaultLanguage();
  }

  private setDefaultLanguage() {
    this.translate.setDefaultLang('hi');
    this.translate.use("hi");
  }
}
