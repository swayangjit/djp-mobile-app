import { BotMessage } from "src/app/appConstants";

export interface ApiConfig {
    authentication?: {
        userToken?: string;
        bearerToken?: string;
    };
    deviceInfo?: {
        did: string;
    }
}

export interface BotConfig {
    storySakhi?: Array<BotMessage>;
    teacherSakhi?: Array<BotMessage>;
    paretSakhi?: Array<BotMessage>;
}

export class ApiModule {
    // tslint:disable-next-line:member-ordering
    static _instance?: ApiModule;

    public static getInstance(): ApiModule {
        if (!ApiModule._instance) {
            ApiModule._instance = new ApiModule();
        }

        return ApiModule._instance;
    }

    private _isInitialised = false;

    isInitialised(): boolean {
        return this._isInitialised;
    }

    private config: ApiConfig = {};
    private botMsg: BotConfig = {};

    getConfig(): ApiConfig {
        return this.config;
    }

    public async init(deviceId: string) {
        this._isInitialised = true;
        this.config = {
            authentication :{
                bearerToken : ''
            },
            deviceInfo :{
                did : deviceId
            }
        };
    }

    getSakhiResponse(): BotConfig {
        return this.botMsg;
    }

    public async setSakhiResponse(res: any) {
        this.botMsg = {
            storySakhi: res.story,
            teacherSakhi: res.teacher,
            paretSakhi: res.parent
        }
    }
}