import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { catchError, from, mergeMap, Observable, of, throwError } from "rxjs";
import { StorageService, UtilService } from "..";
import { ApiModule } from "./api.module";
import { HttpService } from "./http.service";
import { BearerTokenRefreshInterceptor } from "./interceptor/bearer.token.refresh.interceptor";
import { ApiRequest } from "./model/api.request";
import { ApiRequestInterceptor } from "./model/api.request.interceptor";
import { ApiResponse } from "./model/api.response";
import { ApiResponseInterceptor } from "./model/api.response.interceptor";
import { ApiTokenHandler } from "./util/api.token.handler";
import { Network } from '@capacitor/network';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private connected = true;
    private language: string = ''
    private defaultRequestInterceptors: ApiRequestInterceptor[] = [];
    private defaultResponseInterceptors: ApiResponseInterceptor[] = [];
    private bearerTokenRefreshInterceptor?: BearerTokenRefreshInterceptor;


    constructor(
        private readonly httpService: HttpService,
        private readonly storageService: StorageService,
        private readonly utilService: UtilService,
        private toastController: ToastController,
        private translate: TranslateService
    ) {
        Network.addListener('networkStatusChange', async (status: any) => {
            this.connected = status.connected;
        });

        this.toastController.create({ animated: false }).then(t => { t.present(); t.dismiss(); });
        this.language = translate.currentLang;
    }

    getBearerTokenRefreshInterceptor(): BearerTokenRefreshInterceptor {
        if (!this.bearerTokenRefreshInterceptor) {
            this.bearerTokenRefreshInterceptor = new BearerTokenRefreshInterceptor(
                this.storageService, this, this.utilService)
        }

        return this.bearerTokenRefreshInterceptor;
    }

    onInit(): Observable<undefined> {
        return from(this.storageService.getData('api_token')).pipe((
            mergeMap((token) => {
                if (!token) {
                    return new ApiTokenHandler(this, this.utilService).refreshAuthToken().pipe(
                        mergeMap((bearerToken) => {
                            ApiModule.getInstance().getConfig().authentication!.bearerToken = bearerToken;
                            return from(this.storageService.setData('api_token', bearerToken!));
                        }),
                        catchError(() => of(undefined))
                    )
                }
                ApiModule.getInstance().getConfig().authentication!.bearerToken = token;
                return of(undefined);
            })
        ))
    }

    public fetch<T = any>(request: ApiRequest): Observable<ApiResponse<T>> {
        this.defaultRequestInterceptors.forEach((i) => {
            if (request.getRequestInterceptors().indexOf(i) === -1) {
                request.getRequestInterceptors().push(i);
            }
        });

        this.defaultResponseInterceptors.forEach((i) => {
            if (request.getResponseInterceptors().indexOf(i) === -1) {
                request.getResponseInterceptors().push(i);
            }
        });

        if (request.withBearerToken) {
            const bearerTokenRefreshInterceptorIndex = request.getResponseInterceptors().indexOf(this.getBearerTokenRefreshInterceptor()!);
            if (bearerTokenRefreshInterceptorIndex === -1) {
                request.getResponseInterceptors().push(this.bearerTokenRefreshInterceptor!);
            } else {
                request.getResponseInterceptors().splice(bearerTokenRefreshInterceptorIndex, 1);
            }
        }
        return this.httpService.fetch<T>(request).pipe(
            catchError((e) => {
                return throwError(() => e);
            }));
    }

    setDefaultRequestInterceptors(interceptors: ApiRequestInterceptor[]) {
        this.defaultRequestInterceptors = interceptors;
    }

    setDefaultResponseInterceptors(interceptors: ApiResponseInterceptor[]) {
        this.defaultResponseInterceptors = interceptors;
    }
}