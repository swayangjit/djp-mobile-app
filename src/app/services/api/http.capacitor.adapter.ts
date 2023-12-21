import { Injectable } from "@angular/core";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "./http.client";
import { ApiHttpRequestType, ApiRequest } from "./model/api.request";
import { ApiResponse } from "./model/api.response";

@Injectable({
    providedIn: 'root'
  })
export class HttpCapacitorAdapter implements HttpClient{

    private http = CapacitorHttp;

    constructor() {
    }


    get(baseUrl: string, path: string, headers: any, parameters: { [key: string]: string }): Observable<ApiResponse> {
        return this.invokeRequest(ApiHttpRequestType.GET, baseUrl + path, parameters, headers);
    }

    patch(baseUrl: string, path: string, headers: any, body: {}): Observable<ApiResponse> {
        return this.invokeRequest(ApiHttpRequestType.PATCH, baseUrl + path, body, headers);
    }

    post(baseUrl: string, path: string, headers: any, body: {}): Observable<ApiResponse> {
        return this.invokeRequest(ApiHttpRequestType.POST, baseUrl + path, body, headers);
    }

    private invokeRequest(type: ApiHttpRequestType, url: string, parametersOrData: any,
                          headers: { [key: string]: string }): Observable<ApiResponse> {
        const observable = new Subject<ApiResponse>();

        const requestOptions: any = {
            url: url,
            method: type.toLowerCase(),
            headers: headers,
        };

        if (
          type === ApiHttpRequestType.POST ||
          type === ApiHttpRequestType.PATCH
        ) {
            requestOptions['data'] = parametersOrData;
        } else if (
          type === ApiHttpRequestType.GET ||
          type === ApiHttpRequestType.DELETE
        ) {
            requestOptions['params']  = parametersOrData;
        }
        console.log('requestOptions', requestOptions);
        
        this.http.request(requestOptions).then((response: HttpResponse) => {
            response.data = response.data;
            const apiResponse: ApiResponse = {
                body: response.data,
                responseCode : response.status,
                errorMesg : '',
                headers : response.headers
            }
            console.log('apiResponse', apiResponse);
            observable.next(apiResponse);
            observable.complete();
        }).catch((response) => {
            console.error('error', response);
            const apiResponse: ApiResponse = {
                body: {},
                responseCode : response.status,
                errorMesg : 'SERVER_ERROR',
                headers : response.headers
            }
            try {
                try {
                    response.body = JSON.parse(response.error!);
                } catch (e) {
                    apiResponse.body = response.error;
                    if (response.status <= 0) {
                      throw e;
                    }
                }
                if (response.responseCode >= 400 && response.responseCode <= 499) {
                    observable.error(new Error());
                } else {
                    observable.error(new Error());
                }
            } catch (e) {
                observable.error(new Error());
                observable.complete();
            }
        })

        return observable;
    }
}