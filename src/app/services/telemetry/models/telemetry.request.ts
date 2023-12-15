import { CorrelationData, DeviceSpecification, Rollup } from "./telemetry";


export class TelemetryInteractRequest {
    type?: string;
    subType?: string;
    id?: string;
    pageId?: string;
    pos?: Array<{ [index: string]: string }> = [];
    env?: string;
    rollup?: Rollup;
    valueMap?: { [index: string]: any };
    correlationData?: Array<CorrelationData>;
    objId?: string;
    objType?: string;
    objVer?: string;
}

export class TelemetryImpressionRequest {
    type?: string;
    subType?: string;
    pageId?: string;
    env: string = '';
    objId?: string;
    objType?: string;
    objVer?: string;
    correlationData?: Array<CorrelationData>;
    rollup?: Rollup;
}

export class TelemetryStartRequest {
    type?: string;
    deviceSpecification?: DeviceSpecification;
    loc?: string;
    mode?: string;
    duration?: number;
    pageId?: string;
    env: string = '';
    objId?: string;
    objType?: string;
    objVer?: string;
    rollup?: Rollup;
    correlationData?: Array<CorrelationData>;
}

export class TelemetryEndRequest {
    env: string = '';
    type?: string;
    mode?: string;
    duration?: number;
    pageId?: string;
    objId?: string;
    objType?: string;
    objVer?: string;
    rollup?: Rollup;
    summaryList?: Array<{ [index: string]: any }>;
    correlationData?: Array<CorrelationData>;
}

export class TelemetySearchRequest {
    type?: string;
    query?: string;
    filters?:{ [index: string]: string };
    sort?:{ [index: string]: string };
    correlationid?: string;
    size?: number;
    env?: string;
    correlationData?: Array<CorrelationData>;
}