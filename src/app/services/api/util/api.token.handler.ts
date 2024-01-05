import { from, Observable } from "rxjs";
import { ApiHttpRequestType, ApiRequest } from "../model/api.request";
import * as dayjs from 'dayjs';
import { UtilService } from "../..";
import { ApiService } from "../api.service";
import { config } from 'src/environments/environment.prod';

export class ApiTokenHandler {

    private static readonly VERSION = '1.0';
    private static readonly ID = 'org.myjp.device.register';
    getJWTToken = (key: string, secret: string) =>
        new Promise((resolve, reject) => {
            (window as any).FilePath.getJWTToken(key, secret, resolve, (err: any) => {
                console.error(
                    `${key} could not be resolved by the plugin: ${err.message}`
                )
                reject(err)
            })
        });
    constructor(
        private apiService: ApiService,
        private utilService: UtilService
    ) {
    }

    public refreshAuthToken(): Observable<string> {
        return from(
            this.getBearerTokenFromKong()
        );
    }

    private async getMobileDeviceConsumerKey() {
        return await this.utilService.getDeviceId();
    }

    private async buildGetMobileDeviceConsumerSecretAPIRequest(path: string): Promise<ApiRequest> {
        return Promise.resolve(new ApiRequest.Builder()
            .withHost(config.api.BASE_URL)
            .withPath(path)
            .withType(ApiHttpRequestType.POST)
            .withHeaders({
                'Content-Encoding': 'gzip',
                'Authorization': `Bearer ${await this.generateMobileAppConsumerBearerToken()}`
            })
            .withBody({
                id: ApiTokenHandler.ID,
                ver: ApiTokenHandler.VERSION,
                ts: dayjs().format(),
                request: {
                    key:`${config.telmetry.PRODUCER_ID}-${await this.getMobileDeviceConsumerKey()}`
                }
            })
            .build());
    }

    private async getBearerTokenFromKong(): Promise<string> {
        return this.apiService.fetch(await this.buildGetMobileDeviceConsumerSecretAPIRequest(config.api.REGISTER_DEVICE_API_PATH)).toPromise()
            .then((res: any) => {
                return res.body.result.token;
            }).catch((e) => {
                throw e;
            });
    }
    private async generateMobileAppConsumerBearerToken(): Promise<any> {
        return await this.getJWTToken(config.api.KEY, config.api.SECRET)
    }
}