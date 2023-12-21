export class Actor {
    static readonly TYPE_SYSTEM = 'System';
    static readonly TYPE_USER = 'User';
    id: string = '';
    type: string;

    constructor() {
        this.type = Actor.TYPE_USER;
    }
}

export class Context {
    env: string | undefined;
    cdata: Array<CorrelationData> | undefined;
    channel: string | undefined;
    pdata: ProducerData | undefined;
    sid: string | undefined;
    did: string | undefined;
    rollup: Rollup | undefined;
}

export class CorrelationData {
    id: string | undefined;
    type: string | undefined;
}

export class Rollup {
    l1?: string;
    l2?: string;
    l3?: string;
    l4?: string;
}


export class ProducerData {
    id: string | undefined;
    pid: string | undefined;
    ver: string | undefined;

    ProducerData() {
        this.id = '';
        this.pid = '';
        this.ver = '';
    }
}

export class DeviceSpecification {
    os = '';
    make = '';
    id = '';
    mem = -1.0;
    idisk = -1.0;
    edisk = -1.0;
    scrn = -1.0;
    camera: string | undefined;
    cpu = '';
    sims = -1;
    cap: Array<string> = [];
}

export class TelemetryObject {
    public rollup?: Rollup;
    public readonly id: string;
    public readonly type: string;
    public readonly version: string;

    constructor(id: string, type: string, version: string) {
        this.id = id;
        this.type = type;
        this.version = version;
    }

    public setRollup(value: Rollup) {
        this.rollup = value;
    }
}

export namespace DJPTelemetry {
    export abstract class Telemetry {
        private static readonly TELEMETRY_VERSION: string = '3.0';

        public eid: string;
        public mid: string | undefined;
        public ets: number;
        public ver: string = Telemetry.TELEMETRY_VERSION;
        public actor: Actor;
        public context: Context;
        public object: TelemetryObject | undefined;
        public edata: any;
        public tags: string[] | undefined;

        protected constructor(eid: string) {
            this.eid = eid;
            this.ets = Date.now();
            this.actor = new Actor();
            this.context = new Context();
            this.edata = {};
        }
    }

    export class Interact extends Telemetry {
        private static readonly EID = 'INTERACT';

        constructor(type: string,
            subtype: string,
            id: string | undefined,
            pageid: string | undefined,
            pos: { [key: string]: string }[] | undefined,
            valuesMap: { [key: string]: any } | undefined,
            env: string,
            objId: string = '',
            objType: string = '',
            objVer: string = '',
            rollup: Rollup = {},
            correlationData: Array<CorrelationData> = []) {
            super(Interact.EID);
            this.edata = {
                ...{ type },
                ...{ subtype },
                ...(id ? { id } : {}),
                ...(pageid ? { pageid } : {}),
                extra: {
                    ...(pos ? { pos } : {}),
                    ...(valuesMap ? { values: [valuesMap] } : {}),
                }
            };
            this.context.cdata = correlationData;
            this.context.env = env;
            if (objId && objType) {
                this.object = new TelemetryObject(objId, objType, objVer);
                if (rollup) {
                    this.object.rollup = rollup ? rollup : {};
                }
            }
        }
    }

    export class End extends Telemetry {
        private static readonly EID = 'END';

        public constructor(type: string | undefined,
            mode: string | undefined,
            duration: number | undefined,
            pageid: string | undefined,
            summaryList: {}[] | undefined,
            env: string,
            objId: string = '',
            objType: string = '',
            objVer: string = '',
            rollup: Rollup = {},
            correlationData: Array<CorrelationData> = []) {
            super(End.EID);
            this.edata = {
                ...(type ? { type } : {}),
                ...(duration ? { duration } : {}),
                ...(pageid ? { pageid } : {}),
                ...(mode ? { mode } : {}),
                ...(summaryList ? { summaryList } : {})
            };
            this.context.cdata = correlationData;
            this.context.env = env;

            this.object = new TelemetryObject(objId, objType, objVer);
            this.object.rollup = rollup;
        }
    }

    export class Start extends Telemetry {
        private static readonly EID = 'START';

        constructor(type: string = '',
            dspec: DeviceSpecification | undefined,
            loc: string | undefined,
            mode: string | undefined,
            duration: number | undefined,
            pageid: string | undefined,
            env: string,
            objId: string = '',
            objType: string = '',
            objVer: string = '',
            rollup: Rollup = {},
            correlationData: Array<CorrelationData> = []) {
            super(Start.EID);
            this.edata = {
                ...(type ? { type } : { type: '' }),
                ...(dspec ? { dspec } : {}),
                ...(loc ? { loc } : {}),
                ...(mode ? { mode } : {}),
                ...(duration ? { mode } : {}),
                ...(pageid ? { pageid } : {})
            };
            this.context.cdata = correlationData;
            this.context.env = env;
            if (objId && objType) {
                this.object = new TelemetryObject(objId, objType, objVer);
                if (rollup) {
                    this.object.rollup = rollup ? rollup : {};
                }
            }
        }
    }

    export class Impression extends Telemetry {
        private static readonly EID = 'IMPRESSION';

        public constructor(type: string | undefined,
            subtype: string | undefined,
            pageid: string | undefined,
            visits: [],
            env: string,
            objId: string = '',
            objType: string = '',
            objVer: string = '',
            rollup: Rollup = {},
            correlationData: Array<CorrelationData> = []) {
            super(Impression.EID);
            this.edata = {
                ...(type ? { type } : { type: '' }),
                ...(subtype ? { subtype } : {}),
                ...(pageid ? { pageid } : {}),
                ...(pageid ? { uri: pageid } : {}),
                ...(visits ? { visits } : {}),
            };
            this.context.cdata = correlationData;
            this.context.env = env;
            if (objId && objType) {
                this.object = new TelemetryObject(objId, objType, objVer);
                if (rollup) {
                    this.object.rollup = rollup ? rollup : {};
                }
            }
        }
    }

    export class Search extends Telemetry {
        private static readonly EID = 'SEARCH';

        public constructor(
            type: string | undefined,
            query: string | undefined,
            filters: any | undefined,
            sort: any | undefined,
            env?: string,
            correlationid?: string,
            size: number = 0,
            correlationData: Array<CorrelationData> = []) {
            super(Search.EID);
            this.edata = {
                ...(type ? { type } : { type: '' }),
                ...(query ? { query } : {}),
                ...(filters ? { filters } : {}),
                ...(sort ? { sort } : {}),
                ...(correlationid ? { correlationid } : {}),
                ...(size ? { size } : {}),
            };
            this.context.cdata = correlationData;
            this.context.env = env;
        }
    }
}