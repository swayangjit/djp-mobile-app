import {Observable, of} from 'rxjs';
import { ApiModule } from '../api.module';
import { ApiRequest } from '../model/api.request';
import { ApiRequestInterceptor } from '../model/api.request.interceptor';

export class BearerTokenInjectRequestInterceptor implements ApiRequestInterceptor {
    constructor(
    ) {
    }

    interceptRequest(request: ApiRequest): Observable<ApiRequest> {
        const bearerToken = ApiModule.getInstance().getConfig().authentication?.bearerToken;
        if (bearerToken) {
            request.headers['Authorization'] = `Bearer ${bearerToken}`;
        }
        return of(request);
    }
}
