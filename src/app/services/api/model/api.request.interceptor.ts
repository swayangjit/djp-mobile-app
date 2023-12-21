import {Observable} from 'rxjs';
import { ApiRequest } from './api.request';

export interface ApiRequestInterceptor {
    interceptRequest(request: ApiRequest): Observable<ApiRequest>;
}