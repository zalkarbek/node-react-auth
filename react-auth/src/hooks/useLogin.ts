import { useCallback, useState } from 'react';
import { useLoading } from './useLoading.ts';
import { useAuthState } from './useAuthState.ts';
import {login} from "../api/auth.ts";
import {fetchUser} from "../api/users.ts";

export const useLogin = () => {
    const { loading, startLoading, stopLoading } = useLoading();
    const [error, setError] = useState<string | null>(null);
    const { setAuthTokenState, setAuthUserState } = useAuthState();

    const toLogin = useCallback(async (
        email: string,
        password: string
    ): Promise<boolean> => {

        startLoading();
        setError(null);

        try {
            const { token, success } = await login({ email, password });

            if (!success && !token) {
                setError('Неверный логин или пароль');
                return false;
            }

            await setAuthTokenState({ token })

            const user = await fetchUser(token);
            if (!user) {
                setError('Не удалось авторизоваться повторите позже');
                return false;
            }

            await setAuthUserState({ user })

            return true;

        } catch (e) {

            if(e instanceof Error) {
                setError(e.message || 'Ошибка авторизации');
                throw e;
            }
            setError('Неизвестная ошибка');
            return false;
        }
        finally {
            stopLoading();
        }
    }, [setAuthTokenState, setAuthUserState, startLoading, stopLoading]);

    return { toLogin, loading, error };
};
