export abstract class PlayerTelemetryService {
    abstract onStartEvent(event: any, data: any): any;
    abstract onEndEvent(event: any, data: any): any;
    abstract onHeartBeatEvent(event: any, data: any): any;
    abstract onErrorEvent(event: any, data: any): any;
}