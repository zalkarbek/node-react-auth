
export function loadFromStorage<T = unknown>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
        const parsed = JSON.parse(item);
        if (parsed && typeof parsed === 'object') {
            return parsed as T;
        }

    } catch (e) {
        if (import.meta.env.DEV) {
            console.error(`Ошибка при чтении ${key} из localStorage:`, e);
        }
    }

    return null;
}

export function saveToStorage<T = unknown>(key: string, state: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(state));

    } catch (e) {
        if (import.meta.env.DEV) {
            console.error(`Ошибка при записи ${key} в localStorage:`, e);
        }
    }
}
