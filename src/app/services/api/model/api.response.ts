export class ApiResponse<T = any> {

    public responseCode!: number;
    public errorMesg!: string;
    public body!: T;
    public headers: any;
}