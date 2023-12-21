import { ApiError } from "./api.error";
import { ApiResponse } from "./api.response";

export class HttpServerError extends ApiError {
    private static code = 'HTTP_SERVER_ERROR';

    constructor(message: string, public readonly response: ApiResponse) {
        super(message, HttpServerError.code);

        Object.setPrototypeOf(this, HttpServerError.prototype);
    }

    static isInstance(obj: any): boolean {
        return obj['code'] && obj['code'] === HttpServerError.code;
    }
}