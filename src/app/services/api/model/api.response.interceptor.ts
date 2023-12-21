import { Observable } from "rxjs";
import { ApiRequest } from "./api.request";
import { ApiResponse } from "./api.response";

export interface ApiResponseInterceptor {
    interceptResponse(request: ApiRequest, response: ApiResponse): Observable<ApiResponse>;
}