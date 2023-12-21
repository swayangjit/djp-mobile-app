import { mergeMap, Observable, of, tap } from "rxjs";
import { StorageService, UtilService } from "../..";
import { ApiService } from "../api.service";
import { ApiRequest, HttpResponseCode } from "../model/api.request";
import { ApiResponse } from "../model/api.response";
import { ApiResponseInterceptor } from "../model/api.response.interceptor";
import { ApiTokenHandler } from "../util/api.token.handler";

export class BearerTokenRefreshInterceptor implements ApiResponseInterceptor {
    private apiTokenHandler: ApiTokenHandler;

    constructor(
        private storageService: StorageService,
        private apiService: ApiService,
        private utilService: UtilService
    ) {
        this.apiTokenHandler = new ApiTokenHandler(this.apiService, this.utilService);
    }

    interceptResponse(request: ApiRequest, response: ApiResponse): Observable<ApiResponse> {
        if ((response.responseCode === HttpResponseCode.HTTP_UNAUTHORISED && response.body.message === 'Unauthorized')
            || response.responseCode === HttpResponseCode.HTTP_FORBIDDEN) {
            return this.apiTokenHandler.refreshAuthToken()
                .pipe(
                    tap(async (bearerToken) => {
                        await this.storageService.setData('api_token', bearerToken);
                    }),
                    mergeMap(() => this.apiService.fetch(request))
                );
        }

        return of(response);
    }
}