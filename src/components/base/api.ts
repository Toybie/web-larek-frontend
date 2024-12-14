export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            },
            ...options,
        };
    }

    // Универсальный метод обработки ответа
    protected handleResponse<Type>(response: Response): Promise<Type> {
        if (response.ok) {
            return response.json() as Promise<Type>;
        } else {
            return response.json()
                .then(data => Promise.reject(data.error ?? response.statusText));
        }
    }

    // GET-запрос с поддержкой любых типов ответа
    get<Type>(uri: string): Promise<Type> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(response => this.handleResponse<Type>(response));
    }

    // POST-запрос с поддержкой типизации
    post<Type>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<Type> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(response => this.handleResponse<Type>(response));
    }
}
