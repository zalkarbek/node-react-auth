import type {AuthResponse, LoginRequest, RegisterRequest} from "../types.ts";
import {baseUrl} from "../constant.ts";
import {defaultFetchInitHeaders} from "./config.ts";
import {post} from "./api.ts";

async function handleError(response: Response) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Ошибка запроса: ${response.status}`;
    throw new Error(errorMessage);
}

export async function login ({ email, password }: LoginRequest): Promise<AuthResponse> {
    const response: Response = await post(`${baseUrl}/api/user/auth`, {
        body: JSON.stringify({ email, password }),
        headers: {
            ...defaultFetchInitHeaders.headers
        },
    });

    if (!response.ok) {
        await handleError(response);
    }

    return await response.json();
}

export async function register ({ email, password, name }: RegisterRequest): Promise<AuthResponse> {
    const response: Response = await post(`${baseUrl}/api/user`, {
        body: JSON.stringify({ email, password, name }),
        headers: {
            ...defaultFetchInitHeaders.headers
        },
    });

    if (!response.ok) {
        await handleError(response);
    }

    return await response.json();
}
