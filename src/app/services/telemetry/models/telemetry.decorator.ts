import { Injectable } from "@angular/core";
import * as MD5 from 'crypto-js/md5';
import { config } from "src/environments/environment.prod";
import { UtilService } from "../..";
import { Actor, Context, CorrelationData, DJPTelemetry, ProducerData } from "./telemetry";
import Telemetry = DJPTelemetry.Telemetry;

@Injectable({
    providedIn: 'root'
})
export class TelemetryDecorator {
    constructor(
        private utilService: UtilService
    ) { }

    decorate(
        event: Telemetry,
        sid: string,
        did: string,
        mid: string,
        version: string,
        channelId: string,
        globalCData?: CorrelationData[]
    ): any {
        if (!event.mid) {
            event.mid = `${event.eid}:${MD5(JSON.stringify(event)).toString()}`;
        }
        this.patchActor(event, did);
        this.patchContext(event, sid, did, version, channelId, globalCData);
        if (event.context.cdata) {
            event.context.cdata = [
                ...event.context.cdata, {
                    id: sid,
                    type: 'UserSession'
                }
            ];
        }

        return event;
    }

    private patchActor(event: Telemetry, uid: string) {
        if (!event.actor) {
            event.actor = new Actor();
        }
        const actor: Actor = event.actor;
        if (!actor.id) {
            actor.id = uid;
        }
        if (!actor.type) {
            actor.type = Actor.TYPE_USER;
        }
    }

    private patchContext(event: Telemetry, sid: string, did: string, version: string, channelId: string, globalCdata?: CorrelationData[]) {
        if (!event.context) {
            event.context = new Context();
        }
        event.context = this.buildContext(sid, did, channelId, event.context, version, globalCdata);
    }

    private patchPData(event: Context, version: string) {
        if (!event.pdata) {
            event.pdata = new ProducerData();
        }
        const pData: ProducerData = event.pdata;
        if (!pData.id) {
            pData.id = config.telmetry.PRODUCER_ID;
        }
        pData.pid = config.telmetry.PRODUCER_PID;

        if (!pData.ver) {
            pData.ver = version;
        }
    }

    prepare(event: Telemetry, priority: number) {
        return {
            event: JSON.stringify(event),
            event_type: event.eid,
            timestamp: Date.now(),
            priority: 1
        };
    }

    buildContext(sid: string, did: string, channelId: string, context: Context, version: string, globalCData?: CorrelationData[]): Context {
        context.channel = channelId;
        this.patchPData(context, version);
        if (!context.env) {
            context.env = 'app';
        }
        context.sid = sid;
        context.did = did;
        context.cdata = context.cdata ? context.cdata.concat(globalCData || []) : (globalCData || []);
        return context;
    }
}
