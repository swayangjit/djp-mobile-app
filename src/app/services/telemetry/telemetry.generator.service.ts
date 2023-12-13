import { Injectable } from '@angular/core';
import { ITelemetryContext, IProducerdata, IActor, ITelemetry, } from './telemetry-request';
import { DbService } from '../db/db.service';
import { initTelemetryContext, syncTelemetryReq } from './telemetryConstants';
import { StorageService } from '../storage.service';
import { UtilService } from '../util.service';
import { TelemetryConfigEntry } from '../db/telemetrySchema';
import { ApiService } from '../api.service';
import { APIConstants } from 'src/app/appConstants';
import { defer, from, mergeMap, Observable, of, zip } from 'rxjs';
import { Device } from '@capacitor/device';
import { TelemetrySyncHandler } from './utils/telemetry.sync.handler';
import { TelemetryEndRequest, TelemetryImpressionRequest, TelemetryInteractRequest, TelemetryStartRequest } from './models/telemetry.request';
import { CorrelationData, DeviceSpecification, DJPTelemetry, Rollup, TelemetryObject } from './models/telemetry';
import { TelemetryDecorator } from './models/telemetry.decorator';
import { TelemetryService } from '..';

declare const window: any;

@Injectable({
    providedIn: 'root'
})
export class TelemetryGeneratorService {
    constructor(
        private telemetryService: TelemetryService,
    ) {
    }

    generateInteractTelemetry(interactType: string, interactSubtype: string, env: string, pageId: string, object?: TelemetryObject, values?: Map<string, any>,
        rollup?: Rollup, corRelationList?: Array<CorrelationData>, id?: string) {

        const telemetryInteractRequest = new TelemetryInteractRequest();
        telemetryInteractRequest.type = interactType;
        telemetryInteractRequest.subType = interactSubtype;
        telemetryInteractRequest.pageId = pageId;
        telemetryInteractRequest.id = id ? id : pageId;
        telemetryInteractRequest.env = env;
        if (values !== null) {
            telemetryInteractRequest.valueMap = values;
        }
        if (rollup !== undefined) {
            telemetryInteractRequest.rollup = rollup;
        }
        if (corRelationList !== undefined) {
            telemetryInteractRequest.correlationData = corRelationList;
        }

        if (object && object.id) {
            telemetryInteractRequest.objId = object.id;
        }

        if (object && object.type) {
            telemetryInteractRequest.objType = object.type;
        }

        if (object && object.version) {
            telemetryInteractRequest.objVer = object.version + '';
        }
        this.telemetryService.interact(telemetryInteractRequest).subscribe();
    }

    generateImpressionTelemetry(type: string, subtype: string, pageId: string, env: string, objectId?: string, objectType?: string,
        objectVersion?: string, rollup?: Rollup, corRelationList?: Array<CorrelationData>) {

        const telemetryImpressionRequest = new TelemetryImpressionRequest();
        telemetryImpressionRequest.type = type;
        telemetryImpressionRequest.subType = subtype;
        telemetryImpressionRequest.pageId = pageId;
        telemetryImpressionRequest.env = env;
        telemetryImpressionRequest.objId = objectId ? objectId : '';
        telemetryImpressionRequest.objType = objectType ? objectType : '';
        telemetryImpressionRequest.objVer = objectVersion ? objectVersion + '' : '';

        if (rollup !== undefined) {
            telemetryImpressionRequest.rollup = rollup;
        }
        if (corRelationList !== undefined) {
            telemetryImpressionRequest.correlationData = corRelationList;
        }
        this.telemetryService.impression(telemetryImpressionRequest).subscribe();
    }

    generateEndTelemetry(type: string, mode: string, pageId: string, env: string, object?: TelemetryObject, rollup?: Rollup, corRelationList?: Array<CorrelationData>) {
        const telemetryEndRequest = new TelemetryEndRequest();
        telemetryEndRequest.type = type;
        telemetryEndRequest.pageId = pageId;
        telemetryEndRequest.env = env;
        telemetryEndRequest.mode = mode;
        if (object && object.id) {
            telemetryEndRequest.objId = object.id;
        }

        if (object && object.type) {
            telemetryEndRequest.objType = object.type;
        }

        if (object && object.version) {
            telemetryEndRequest.objVer = object.version + '';
        }
        if (rollup) {
            telemetryEndRequest.rollup = rollup;
        }
        if (corRelationList) {
            telemetryEndRequest.correlationData = corRelationList;
        }
        this.telemetryService.end(telemetryEndRequest).subscribe();
    }

    generateStartTelemetry(pageId: string, object?: TelemetryObject, rollup?: Rollup, corRelationList?: Array<CorrelationData>) {
        const telemetryStartRequest = new TelemetryStartRequest();
        telemetryStartRequest.type = object?.type;
        telemetryStartRequest.pageId = pageId;
        telemetryStartRequest.mode = 'play';
        if (object && object.id) {
            telemetryStartRequest.objId = object.id;
        }

        if (object && object.type) {
            telemetryStartRequest.objType = object.type;
        }

        if (object && object.version) {
            telemetryStartRequest.objVer = object.version + '';
        }
        if (rollup !== undefined) {
            telemetryStartRequest.rollup = rollup;
        }
        if (corRelationList !== undefined) {
            telemetryStartRequest.correlationData = corRelationList;
        }

        this.telemetryService.start(telemetryStartRequest).subscribe();
    }
    genererateAppStartTelemetry(deviceSpec: DeviceSpecification) {
        const telemetryStartRequest = new TelemetryStartRequest();
        telemetryStartRequest.type = 'app';
        telemetryStartRequest.env = 'home';
        telemetryStartRequest.deviceSpecification = deviceSpec;
        this.telemetryService.start(telemetryStartRequest).subscribe();
    }
}   
