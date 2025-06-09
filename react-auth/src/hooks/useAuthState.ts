import {useState, useCallback, useEffect} from 'react';
import type {AuthState, SetAuthAuthenticatedState, SetAuthTokenState, SetAuthUserState, User} from "../types.ts";
import {loadFromStorage, saveToStorage} from "../services/storageService.ts";

export const useAuthState = () => {
    const [user, setUser] = useState<User | null | undefined>(null);
    const [token, setToken] = useState<string | null | undefined>(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const auth = loadFromStorage<AuthState>('auth');
        if (auth) {
            const { user, token, authenticated } = auth;
            setUser(user);
            setToken(token);
            setAuthenticated(authenticated);
        }
    }, []);

    const setAuthState = useCallback(async (state: AuthState) => {

        saveToStorage<AuthState>('auth', state);
        setUser(state.user);
        setToken(state.token);
        setAuthenticated(state.authenticated);

    }, []);

    const setAuthTokenState = useCallback(async (state: SetAuthTokenState) => {

        await setAuthState({ token: state.token, authenticated, user })

    }, [setAuthState, authenticated, user]);

    const setAuthAuthenticatedState = useCallback(async (state: SetAuthAuthenticatedState) => {

        await setAuthState({ authenticated: state.authenticated, token, user });

    }, [setAuthState, token, user]);

    const setAuthUserState = useCallback(async (state: SetAuthUserState) => {

        await setAuthState({ user: state.user, token, authenticated });

    }, [setAuthState, authenticated, token]);

    return {
        user,
        token,
        authenticated,
        setAuthState,
        setAuthTokenState,
        setAuthUserState,
        setAuthAuthenticatedState
    };
};
