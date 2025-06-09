export async function get(url: string, init: RequestInit | null | undefined) {
    return fetch(url, {
        method: 'GET',
        ...(init ?? {}),
    });
}

export function post(url: string, init: RequestInit | null | undefined) {
    return fetch(url, {
        method: 'POST',
        ...(init ?? {}),
    });
}
