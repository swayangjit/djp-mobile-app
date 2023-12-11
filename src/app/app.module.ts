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
import { ApiService } from './services/api.service';
import { ConfigService } from './services/config.service';
import { DikshaPreprocessorService, PreprocessorService, SunbirdPreprocessorService } from './services';

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
    AppHeaderService,
    UtilService,
    ContentService,
    PlaylistService,
    ApiService,
    ConfigService,
    PreprocessorService,
    SunbirdPreprocessorService,
    DikshaPreprocessorService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {
  constructor(private translate: TranslateService) {
    this.setDefaultLanguage();
  }

  private setDefaultLanguage() {
    this.translate.setDefaultLang('en');
    this.translate.use("en");
  }
}
