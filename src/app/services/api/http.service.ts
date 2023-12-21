import { Injectable } from "@angular/core";
import { from, lastValueFrom, Observable, of } from "rxjs";
import { ApiModule } from "./api.module";
import { HttpCapacitorAdapter } from "./http.capacitor.adapter";
import { HttpClient } from "./http.client";
import { BearerTokenInjectRequestInterceptor } from "./interceptor/bearer.token.inject.request.interceptor";
import { ApiHttpRequestType, ApiRequest, HttpResponseCode } from "./model/api.request";
import { ApiRequestInterceptor } from "./model/api.request.interceptor";
import { ApiResponse } from "./model/api.response";
import { ApiResponseInterceptor } from "./model/api.response.interceptor";
import { HttpClientError } from "./model/http.client.error";
import { HttpServerError } from "./model/http.serrver.error";
import { v4 as uuidv4 } from "uuid";

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private requestInterceptors: ApiRequestInterceptor[] = [];
    private responseInterceptors: ApiResponseInterceptor[] = [];
    private bearerTokenInjectRequestInterceptor?: BearerTokenInjectRequestInterceptor;

    constructor(
        private http: HttpCapacitorAdapter,
    ) { }

    getBearerTokenInjectRequestInterceptor(): BearerTokenInjectRequestInterceptor {
        if (!this.bearerTokenInjectRequestInterceptor) {
            this.bearerTokenInjectRequestInterceptor = new BearerTokenInjectRequestInterceptor();
        }
        return this.bearerTokenInjectRequestInterceptor;
    }

    public fetch<T = any>(request: ApiRequest): Observable<ApiResponse<T>> {
        request.headers = { ...request.getHeaders(), ...this.addGlobalHeader() };
        this.buildInterceptorsFromRequest(request);
        const response: Promise<ApiResponse<T>> = (async () => {
            let localResponse: ApiResponse<T>;
            request = await this.interceptRequest(request);

            try {
                switch (request.getType()) {
                    case ApiHttpRequestType.GET:
                        localResponse = await lastValueFrom(this.http.get(
                            request.getHost() || 'this.host', request.getPath(), request.headers, request.getParameters()!
                        ));
                        break;
                    case ApiHttpRequestType.PATCH:
                        localResponse = await lastValueFrom(this.http.patch(
                            request.getHost() || 'this.host', request.getPath(), request.headers, request.body!
                        ));
                        break;
                    case ApiHttpRequestType.POST: {
                        localResponse = await lastValueFrom(this.http.post(
                            request.getHost() || 'this.host', request.getPath(), request.headers, request.getBody()!
                        ));
                        break;
                    }
                    default:
                        throw new Error('Unsupported type');
                }

                return await this.interceptResponse(request, localResponse);
            } catch (e: any) {
                const wrapError = (res: ApiResponse<T>) => {
                    if (res.responseCode >= 400 && res.responseCode <= 499) {
                        throw new HttpClientError(`
                            ${request.host + request.path} -
                            ${res.errorMesg || ''}
                        `, res);
                    } else if (res.responseCode >= 500 && res.responseCode <= 599) {
                        throw new HttpServerError(`
                            ${request.host + request.path} -
                            ${res.errorMesg || ''}
                        `, res);
                    }
                    return res;
                };
                if (HttpClientError.isInstance(e) || HttpServerError.isInstance(e)) {
                    try {
                        localResponse = await this.interceptResponse(request, e.response);
                        return wrapError(localResponse);
                    } catch (e: any) {
                        if (e.responseCode) {
                            return wrapError(e);
                        }
                        throw e;
                    }
                } else {
                    throw e;
                }
            }

        })();
        return from(response as Promise<ApiResponse<T>>);
    }

    private addGlobalHeader() {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-device-id': ApiModule.getInstance().getConfig().deviceInfo?.did!,
            'X-Source': 'mobileapp',
            'X-Request-ID': uuidv4(),
            // 'x-preferred-language': this.language,
            'X-CONSUMER-ID': ApiModule.getInstance().getConfig().deviceInfo?.did!
        };
    }

    private async interceptRequest(request: ApiRequest): Promise<ApiRequest> {
        const interceptors = [
            // ...this.requestInterceptors,
            // ...request.getRequestInterceptors()
        ];

        for (const interceptor1 of this.requestInterceptors) {
            interceptors.push(interceptor1)
        }
        for (const interceptor2 of request.requestInterceptors) {
            interceptors.push(interceptor2)
        }
        for (const interceptor of interceptors) {
            request = await lastValueFrom(interceptor.interceptRequest(request));
        }

        return request;
    }

    private async interceptResponse(request: ApiRequest, response: ApiResponse): Promise<ApiResponse> {
        const interceptors = [
            // ...this.responseInterceptors,
            // ...request.getResponseInterceptors()
        ];
        for (const interceptor1 of this.responseInterceptors) {
            interceptors.push(interceptor1)
        }
        for (const interceptor2 of request.getResponseInterceptors()) {
            interceptors.push(interceptor2)
        }
        for (const interceptor of interceptors) {
            response = await lastValueFrom(interceptor.interceptResponse(request, response))
        }

        if (response.responseCode !== HttpResponseCode.HTTP_SUCCESS) {
            throw response;
        }

        return response;
    }

    private buildInterceptorsFromRequest(request: ApiRequest) {
        if (request.withBearerToken && request.requestInterceptors.indexOf(this.bearerTokenInjectRequestInterceptor!) === -1) {
            request.requestInterceptors.push(this.getBearerTokenInjectRequestInterceptor());
        }

    }
}