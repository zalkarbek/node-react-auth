import { useCallback, useState } from 'react';
import { useLoading } from './useLoading.ts';
import { useAuthState } from './useAuthState.ts';
import {register} from "../api/auth.ts";
import {fetchUser} from "../api/users.ts";

export const useRegister = () => {
    const { loading, startLoading, stopLoading } = useLoading();
    const [error, setError] = useState<string | null>(null);
    const { setAuthTokenState, setAuthUserState } = useAuthState();

    const toRegister = useCallback(async (
        email: string,
        password: string,
        name: string,
    ): Promise<boolean> => {

        startLoading();
        setError(null);

        try {
            const { token, success } = await register({ email, password, name });

            if (!success) {
                setError('Ошибка регистрации');
                return false;
            }

            await setAuthTokenState({ token })

            const user = await fetchUser(token);
            if (!user) {
                setError('Не удалось зарегатся повторите позже');
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

    return { toRegister, loading, error };
};
