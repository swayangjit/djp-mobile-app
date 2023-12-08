import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationHeaderComponent } from './application-header/application-header.component';
import { FilterComponent } from './filter/filter.component';
import { ContentCardComponent } from './content-card/content-card.component';
import { StorageService, TelemetryService, UtilService } from '../services';
@NgModule({
    declarations: [
        ApplicationHeaderComponent,
        FilterComponent,
        ContentCardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
    ],
    exports: [
        ApplicationHeaderComponent,
        FilterComponent,
        ContentCardComponent
    ],
    providers: [UtilService, TelemetryService, StorageService],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ComponentsModule { }
