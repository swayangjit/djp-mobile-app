import {IActor, ICDataEntry, IProducerdata, ITelemetryObject} from './telemetry-request';

export abstract class telemetryServices {
    public abstract initTelemetry(telemetryConfig: any): any;
    public abstract raiseInteractTelemetry(interactObject: any): any;
    public abstract raiseStartTelemetry(startEventObject: any): any;
    public abstract raiseEndTelemetry(startEventObject: any): any;
}