import { ApiError } from "./api.error";
import { ApiResponse } from "./api.response";

export class HttpClientError extends ApiError {
    private static code = 'HTTP_CLIENT_ERROR';

    constructor(message: string, public readonly response: ApiResponse) {
        super(message, HttpClientError.code);

        Object.setPrototypeOf(this, HttpClientError.prototype);
    }

    static isInstance(obj: any): boolean {
        return obj['code'] && obj['code'] === HttpClientError.code;
    }
}