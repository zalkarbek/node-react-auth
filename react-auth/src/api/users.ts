import type { User } from "../types.ts";
import { baseUrl } from "../constant.ts";
import {defaultFetchInitHeaders} from './config.ts'
import {post} from "./api.ts";

function urlWithParams(baseUrl: string, queryParams: Record<string, string>) {
    const params = new URLSearchParams(queryParams);
    return `${baseUrl}?${params.toString()}`;
}

async function handleError(response: Response) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Ошибка запроса: ${response.status}`;
    throw new Error(errorMessage);
}

export async function fetchUser (token: string | null | undefined): Promise<User> {

    const url = `${baseUrl}/api/user/fetch`;
    const response: Response = await post(url, {
        headers: {
            ...defaultFetchInitHeaders.headers,
            'Authorization': `Bearer ${token || ''}`,
        },
    });

    if (!response.ok) {
        await handleError(response);
    }

    return await response.json();
}

export async function fetchUserByEmail (email: string, token: string | null | undefined): Promise<User> {

    const url = urlWithParams(`${baseUrl}/api/user/fetch`, { email });
    const response: Response = await post(url, {
        headers: {
            ...defaultFetchInitHeaders.headers,
            'Authorization': `Bearer ${token || ''}`,
        },
    });

    if (!response.ok) {
        await handleError(response);
    }

    return await response.json();
}
