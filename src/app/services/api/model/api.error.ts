export abstract class ApiError {
    private readonly _code: string;

    protected constructor(message: string, code: string) {
        this._code = code;
    }

    getCode(): string {
        return this._code;
    }
}