import { from, Observable } from "rxjs";
import { ApiHttpRequestType, ApiRequest } from "../model/api.request";
import * as dayjs from 'dayjs';
import { UtilService } from "../..";
import { ApiResponse } from "../model/api.response";
import { ApiService } from "../api.service";

export class ApiTokenHandler {

    private static readonly VERSION = '1.0';
    private static readonly ID = 'org.ejp.device.register';

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
            .withHost('https://dev.ejp.sunbird.org/')
            .withPath(path)
            .withType(ApiHttpRequestType.POST)
            .withHeaders({
                'Content-Encoding': 'gzip',
            })
            .withBody({
                id: ApiTokenHandler.ID,
                ver: ApiTokenHandler.VERSION,
                ts: dayjs().format(),
                request: {
                    key: await this.getMobileDeviceConsumerKey()
                }
            })
            .build());
    }

    private async getBearerTokenFromKong(): Promise<string> {
        const apiPathKong = `api/registerMobile`;
        return this.apiService.fetch(await this.buildGetMobileDeviceConsumerSecretAPIRequest(apiPathKong)).toPromise()
            .then((res: any) => {
                return res.body.result.token;
            }).catch((e) => {
                throw e;
            });
    }
}