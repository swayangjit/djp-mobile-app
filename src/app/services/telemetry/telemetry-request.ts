export interface IProducerdata {
    'id': string;
    'ver': string;
    'pid': string;
}

export interface IRollup {
    'l1'?: string;
    'l2'?: string;
    'l3'?: string;
    'l4'?: string;
}

export interface ITelemetryObject {
    'id'?: string;
    'type'?: string;
    'ver'?: string;
    'rollup'?: IRollup;
}

export interface IContext {
    'env': string;
    'sid': string;
    'did': string;
    'channel'?: string;
    'cdata'?: Array<ICDataEntry>;
    'pdata'?: IProducerdata;
    'rollup'?: IRollup;
}

export interface ICDataEntry {
    'type': string;
    'id': string;
}

export interface IActor {
    'id': string;
    'type': string;
}

export interface IEventInput {
    'eid': string;
    'ets': string;
    'ver'?: string;
    'actor'?: IActor;
    'context': IContext;
    'object'?: ITelemetryObject;
    'tags'?: Array<string>;
    'edata'?: any;
    'mid': string;
}

export interface ITelemetry {
    'pdata': IProducerdata;
    'env': string;
    'channel': string;
    'uid'?: string;
    'endpoint': string;
    'did'?: string;
    'authtoken'?: string;
    'sid'?: string;
    'batchsize'?: Number;
    'mode'?: string;
    'host'?: string;
    'tags'?: Array<string>;
    'cdata'?: Array<ICDataEntry>;
    'dispatcher'?: any;
}

export interface ITelemetryContext {
    'config': ITelemetry;
    'userOrgDetails': any;
}