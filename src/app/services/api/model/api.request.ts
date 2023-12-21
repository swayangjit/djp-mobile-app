import { ApiRequestInterceptor } from "./api.request.interceptor";
import { ApiResponseInterceptor } from "./api.response.interceptor";

export enum ApiHttpRequestType {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    PUT = 'PUT'
}

export enum HttpResponseCode {
    HTTP_UNAUTHORISED = 401,
    HTTP_FORBIDDEN = 403,
    HTTP_SUCCESS = 200,
    HTTP_BAD_REQUEST = 400,
    HTTP_KONG_FAILURE = 447,
    HTTP_INTERNAL_SERVER_ERROR = 500,
}

export class ApiRequest {
    public host?: string;
    public requestInterceptors: ApiRequestInterceptor[] = [];
    public responseInterceptors: ApiResponseInterceptor[] = [];
    public withBearerToken = false;
    public withUserToken = false;
    public path!: string;
    public type!: ApiHttpRequestType;


    public headers: { [key: string]: string } = {};
    public body?: {} = {};
    public parameters?: { [key: string]: string } = {};

    static Builder: any = class Builder {

        protected request: ApiRequest;

        constructor() {
            this.request = new ApiRequest();
        }

        withHost(host: string) {
            this.request._host = host;
            return this;
        }

        withPath(path: string) {
            this.request._path = path;
            return this;
        }

        withType(type: ApiHttpRequestType) {
            this.request._type = type;
            return this;
        }

        withResponseInterceptor(responseInterceptor: ApiResponseInterceptor) {
            this.request._responseInterceptors.push(responseInterceptor);
            return this;
        }

        withRequestInterceptor(requestInterceptor: ApiRequestInterceptor) {
            this.request._requestInterceptors.push(requestInterceptor);
            return this;
        }

        withHeaders(headers: { [key: string]: string }) {
            this.request._headers = headers;
            return this;
        }

        withBody(body: {}) {
            this.request._body = body;
            return this;
        }

        withParameters(parameters: { [key: string]: string }) {
            this.request._parameters = parameters;
            return this;
        }

        withBearerToken(required: boolean) {
            this.request.withBearerToken = required;
            return this;
        }

        withUserToken(required: boolean) {
            this.request.withUserToken = required;
            return this;
        }


        build(): ApiRequest {
            if (!this.request._path) {
                throw new Error('withPath() is required');
            }

            if (!this.request._type) {
                throw new Error('withType() is required');
            }

            return this.request;
        }

    };

    private _host?: string;
    private _responseInterceptors: ApiResponseInterceptor[] = [];
    private _withBearerToken = false;
    private _path!: string;
    private _type!: ApiHttpRequestType;


    getWithBearerToken(): boolean {
        return this._withBearerToken;
    }

    setWithBearerToken(value: boolean) {
        this._withBearerToken = value;
    }
    private _headers?: { [key: string]: string } = {};
    private _body?: {} = {};
    private _parameters?: { [key: string]: string } = {};

    getBody(): {} {
        return this._body!;
    }

    protected constructor() {

    }

    private _withUserToken = false;

    setPath(value: string) {
        this._path = value;
    }

    getType(): ApiHttpRequestType {
        return this._type;
    }

    setResponseInterceptors(value: Array<ApiResponseInterceptor>) {
        this._responseInterceptors = value;
    }

    setHeaders(value: { [p: string]: string }) {
        this._headers = value;
    }

    setBody(value: {}) {
        this._body = value;
    }

    getPath(): string {
        return this._path;
    }

    setType(value: ApiHttpRequestType) {
        this._type = value;
    }

    getResponseInterceptors(): Array<ApiResponseInterceptor> {
        return this._responseInterceptors;
    }

    getHeaders(): { [p: string]: string } {
        return this._headers!;
    }

    getParameters(): { [key: string]: string } {
        return this._parameters!;
    }

    setParameters(value: { [key: string]: string }) {
        this._parameters = value;
    }

    getWithUserToken(): boolean {
        return this._withUserToken;
    }

    setWithUserToken(value: boolean) {
        this._withUserToken = value;
    }

    private _requestInterceptors: ApiRequestInterceptor[] = [];

    getRequestInterceptors(): ApiRequestInterceptor[] {
        return this._requestInterceptors;
    }

    getHost(): string | undefined {
        return this._host;
    }
}