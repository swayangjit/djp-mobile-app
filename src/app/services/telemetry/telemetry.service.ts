import { Injectable } from '@angular/core';
import { ITelemetryContext, IProducerdata, IActor, ITelemetry, } from './telemetry-request';
import { DbService } from '../db/db.service';
import { initTelemetryContext } from './telemetryConstants';
import { StorageService } from '../storage.service';
import { UtilService } from '../util.service';
import { TelemetryConfigEntry } from '../db/telemetrySchema';

declare const window: any;

@Injectable({
    providedIn: 'root'
})
export class TelemetryService {
    _isInitialsed: boolean = false;
    telemetryProvider: any;
    context!: ITelemetryContext;
    pData!: IProducerdata;
    actor!: IActor;
    config!: ITelemetry;
    constructor(
        private dbService: DbService,
        private storageService: StorageService,
        private utilService: UtilService
    ) { }

    public async initializeTelemetry() {
        let that = this;
        let context = initTelemetryContext
        context.config.sid = await this.storageService.getData('sid');
        context.config.did = await this.utilService.getDeviceId();
        context.config.dispatcher = {
            dispatch: async function (event: any) {
            let tableData = {event_type: event.eid, event: JSON.stringify(event), timestamp: Date.now(), priority: 1}
            await that.dbService.save(TelemetryConfigEntry.insertData(), tableData);
        }}
        this.initTelemetry(context);
    }

    public initTelemetry(telemetryContext: ITelemetryContext) {
        if (window['EkTelemetry']) {
            this.telemetryProvider = window['EkTelemetry'];
            this._isInitialsed = true;
            this.context = telemetryContext;
            console.log('context ', this.context);
            this.telemetryProvider.initialize(telemetryContext.config);
        }
    }

    public initTelmetry(pdata: IProducerdata, actor: IActor, channel: string, sid: string, did: string) {
        if (this.context != null && this.telemetryProvider) {
            this.telemetryProvider.initialize(this.context.config);
        } else {
            this.config.pdata = pdata;
            this.config.channel = channel;
            this.config.did = did;
            this.config.sid = sid;
            this.actor = actor;
        }
    }
    public setTelemetryAttributes(pdata: IProducerdata, actor: IActor, channel: string, sid: string, did: string) {
        this.config.pdata = pdata;
        this.config.channel = channel;
        this.config.did = did;
        this.config.sid = sid;
        this.actor = actor;
    }

    private isTelemetryInitialised() {
        return this._isInitialsed;
    }

    public raiseInteractTelemetry(interactObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.interact(interactObject.edata, interactObject.options);
        }
    }

    public raiseStartTelemetry(startEventObject: any) {
        if (this.isTelemetryInitialised()) {
            console.log('start event ', startEventObject.edata);
            this.telemetryProvider.start(this.context.config, startEventObject.options.object.id, startEventObject.options.object.ver,
                startEventObject.edata, startEventObject.options
            );
        }
    }
    public raiseEndTelemetry(endEventObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.end(endEventObject.edata, endEventObject.options);
        }
    }
}
