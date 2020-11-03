export enum ContentTypeFlags {
    ApplicationJson = 'application/json; charset=utf-8;',    // 'application/json',
    MultipartFormData = 'multipart/form-data',
    ApplicationFormData = 'application/form-data'
}

export class HeaderTypeFlags {
    public static readonly CORS: { name: string, value: string | string[] }
        = { name: "Access-Control-Allow-Origin", value: "*" };

    public static ContentType(flag: ContentTypeFlags): { name: string, value: string | string[] } {
        return { name: "Content-Type", value: flag };
    }
    public static BearerAuthorization(token: string): { name: string, value: string | string[] } {
        return { name: 'authorization', value: 'bearer ' + token };
    }
}