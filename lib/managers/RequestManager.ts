const DEFAULT_OPTIONS: RequestOptions = {
    method: "GET",
    responseType: "json",
};

const mergeDefault: <T extends object, K extends object>(defaults: T, data?: K) => T & Partial<K> = <T, K>(defaults: T, data?: K) =>
    data ? Object.assign({}, defaults, data) : defaults;

async function resolveResponse(res: Response, parseInto: ParseResponseType = "json"): Promise<any> {
    let data;

    switch (parseInto) {
        case "arrayBuffer":
            data = await res.arrayBuffer();
            break;
        case "blob":
            data = await res.blob();
            break;
        case "document":
            data = new DOMParser().parseFromString(await res.text(), "text/html");
            break;
        case "formData":
            data = await res.formData();
            break;
        case "json":
            data = await res.json();
            break;
        case "text":
            data = await res.text();
            break;
        default:
            data = await res.json();
            break;
    }

    return data;
}

export class Requests {
    public static async get<T>(url: string, options?: RequestOptions): Promise<T> {
        const parsedOptions = mergeDefault(DEFAULT_OPTIONS, options);
        const res = await fetch(url, parsedOptions);
        const data = await resolveResponse(res, parsedOptions.responseType);

        return data;
    }

    public static async post<T>(url: string, body: object, options?: RequestOptions): Promise<T> {
        const parsedOptions = mergeDefault(DEFAULT_OPTIONS, { ...options, method: "POST" });
        const res = await fetch(url, { ...parsedOptions, body: JSON.stringify(body) });
        const data = await resolveResponse(res, parsedOptions.responseType);

        return data;
    }

    public static async patch<T>(url: string, body: object, options?: RequestOptions): Promise<T> {
        const parsedOptions = mergeDefault(DEFAULT_OPTIONS, { ...options, method: "PATCH" });
        const res = await fetch(url, { ...parsedOptions, body: JSON.stringify(body) });
        const data = await resolveResponse(res, parsedOptions.responseType);

        return data;
    }

    public static async delete<T>(url: string, body: object, options?: RequestOptions): Promise<T> {
        const parsedOptions = mergeDefault(DEFAULT_OPTIONS, { ...options, method: "DELETE" });
        const res = await fetch(url, { ...parsedOptions, body: JSON.stringify(body) });
        const data = await resolveResponse(res, parsedOptions.responseType);

        return data;
    }

    public static async head<T>(url: string, options?: RequestOptions): Promise<T> {
        const parsedOptions = mergeDefault(DEFAULT_OPTIONS, { ...options, method: "HEAD" });
        const res = await fetch(url, parsedOptions);
        const data = await resolveResponse(res, parsedOptions.responseType);

        return data;
    }

    public static async createRequest<T>(url: string, options?: RequestOptions & { body: any }): Promise<T> {
        const parsedOptions = mergeDefault(DEFAULT_OPTIONS, { ...options });
        const res = await fetch(url, { ...parsedOptions, body: JSON.stringify(options?.body) });
        const data = await resolveResponse(res, parsedOptions.responseType);

        return data;
    }

    public static createManager(): RequestsManager {
        return new RequestsManager();
    }
}

export class JSFRequest<T = any> {
    public requestHeaders: Record<string, string>;
    public responseHeaders: Record<string, string>;
    public body: any;
    public data: T;
    public method: string;
    public statusCode: number;
    public responseType: ResponseType;
    public url: string;
    public redirected: boolean;

    #options: Partial<RequestOptionsAndBody>;

    public constructor({ res, options, data }: JSFRequestParameters<T>) {
        this.requestHeaders = options.headers as Record<string, string>;
        this.responseHeaders = Object.fromEntries(res.headers);
        this.url = res.url;

        this.redirected = res.redirected;

        this.body = options.body;
        this.statusCode = res.status;
        this.responseType = res.type;

        this.method = options.method || "GET";

        this.#options = options;

        this.data = data;
    }

    public async remakeRequest<T>(options?: RequestOptionsAndBody): Promise<JSFRequest<T>> {
        const res = await fetch(this.url, options || this.#options);
        const data = await resolveResponse(res, options?.responseType);

        return new JSFRequest<T>({ res, options: options || this.#options, data });
    }
}

export class RequestsManager extends Requests {
    public history: JSFRequest[] = [];

    public async get<T>(url: string, options?: RequestOptions): Promise<JSFRequest<T>> {
        const parsedOptions = mergeDefault(DEFAULT_OPTIONS, options);
        const res = await fetch(url, parsedOptions);
        const data = await resolveResponse(res, parsedOptions.responseType);
        const req = new JSFRequest<T>({ res, data, options: { ...parsedOptions } });
        this.history.push(req);
        return req;
    }

    public async post<T>(url: string, body: object, options?: RequestOptions): Promise<JSFRequest<T>> {
        const parsedOptions = mergeDefault(DEFAULT_OPTIONS, { ...options, method: "POST" });
        const res = await fetch(url, { ...parsedOptions, body: JSON.stringify(body) });
        const data = await resolveResponse(res, parsedOptions.responseType);
        const req = new JSFRequest<T>({ res, data, options: { ...parsedOptions } });
        this.history.push(req);
        return req;
    }

    public async patch<T>(url: string, body: object, options?: RequestOptions): Promise<JSFRequest<T>> {
        const parsedOptions = mergeDefault(DEFAULT_OPTIONS, { ...options, method: "PATCH" });
        const res = await fetch(url, { ...parsedOptions, body: JSON.stringify(body) });
        const data = await resolveResponse(res, parsedOptions.responseType);
        const req = new JSFRequest<T>({ res, data, options: { ...parsedOptions } });
        this.history.push(req);
        return req;
    }

    public async delete<T>(url: string, body: object, options?: RequestOptions): Promise<JSFRequest<T>> {
        const parsedOptions = mergeDefault(DEFAULT_OPTIONS, { ...options, method: "DELETE" });
        const res = await fetch(url, { ...parsedOptions, body: JSON.stringify(body) });
        const data = await resolveResponse(res, parsedOptions.responseType);
        const req = new JSFRequest<T>({ res, data, options: { ...parsedOptions } });
        this.history.push(req);
        return req;
    }

    public async head<T>(url: string, options?: RequestOptions): Promise<JSFRequest<T>> {
        const parsedOptions = mergeDefault(DEFAULT_OPTIONS, { ...options, method: "HEAD" });
        const res = await fetch(url, parsedOptions);
        const data = await resolveResponse(res, parsedOptions.responseType);
        const req = new JSFRequest<T>({ res, data, options: { ...parsedOptions } });
        this.history.push(req);
        return req;
    }

    public async request<T>(url: string, options: { method: string; body?: object } & RequestOptions): Promise<JSFRequest<T>> {
        const res = await fetch(url, { ...options, body: JSON.stringify(options.body) });
        const data = await resolveResponse(res, options.responseType);
        const req = new JSFRequest({ res, data, options });
        this.history.push(req);
        return req;
    }
}
