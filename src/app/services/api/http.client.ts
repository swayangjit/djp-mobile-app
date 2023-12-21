import {Observable} from 'rxjs';
import { ApiResponse } from './model/api.response';

export abstract class HttpClient {

    // abstract addHeaders(headers: { [key: string]: string }): void;

    // abstract addHeader(key: string, value: string): void;

    abstract get(baseUrl: string, path: string, headers: any, parameters: any): Observable<ApiResponse>;

    abstract post(baseUrl: string, path: string, headers: any, body: any): Observable<ApiResponse>;

    abstract patch(baseUrl: string, path: string, headers: any, body: any): Observable<ApiResponse>;

    // abstract delete(baseUrl: string, path: string, headers: any, parameters: any): Observable<ApiResponse>;
}
