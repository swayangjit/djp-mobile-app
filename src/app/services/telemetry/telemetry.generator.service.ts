import { Injectable } from '@angular/core';
import { TelemetryEndRequest, TelemetryImpressionRequest, TelemetryInteractRequest, TelemetryStartRequest, TelemetySearchRequest } from './models/telemetry.request';
import { CorrelationData, DeviceSpecification, Rollup, TelemetryObject } from './models/telemetry';
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

    generateEndTelemetry(type: string, mode: string, pageId: string, env: string, object?: TelemetryObject, rollup?: Rollup, corRelationList?: Array<CorrelationData>, duration?: number, extras?: any) {
        const telemetryEndRequest = new TelemetryEndRequest();
        telemetryEndRequest.type = type;
        telemetryEndRequest.pageId = pageId;
        telemetryEndRequest.env = env;
        telemetryEndRequest.mode = mode;
        if(duration) {
            telemetryEndRequest.duration = duration;
        }
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
        if(extras) {
            telemetryEndRequest.summaryList = extras
        }
        this.telemetryService.end(telemetryEndRequest).subscribe();
    }

    generateStartTelemetry(type: string, pageId: string, object?: TelemetryObject, rollup?: Rollup, corRelationList?: Array<CorrelationData>) {
        const telemetryStartRequest = new TelemetryStartRequest();
        telemetryStartRequest.type = type;
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

    generateSearchTelemetry(type: string, query: string, size?: number, env?: string, filters?: any, sort?: any, correlationid?: string, corRelationList?: Array<CorrelationData>) {
        const telemetySearchRequest = new TelemetySearchRequest();
        telemetySearchRequest.type = type;
        telemetySearchRequest.query = query;
        telemetySearchRequest.env = env;
        telemetySearchRequest.size = size;
        if(filters) {
            telemetySearchRequest.filters = filters;
        }
        if(sort) {
            telemetySearchRequest.sort = sort;
        }
        if (corRelationList !== undefined) {
            telemetySearchRequest.correlationData = corRelationList;
        }
        if (correlationid) {
            telemetySearchRequest.correlationid = correlationid;
        }
        this.telemetryService.search(telemetySearchRequest).subscribe();
    }

    genererateAppStartTelemetry(deviceSpec: DeviceSpecification) {
        const telemetryStartRequest = new TelemetryStartRequest();
        telemetryStartRequest.type = 'app';
        telemetryStartRequest.env = 'home';
        telemetryStartRequest.deviceSpecification = deviceSpec;
        this.telemetryService.start(telemetryStartRequest).subscribe();
    }
}   
