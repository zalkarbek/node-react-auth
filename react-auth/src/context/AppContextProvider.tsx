import { AppContext } from "./AppContext";
import { useAuthState } from "../hooks/useAuthState.ts";
import type { ReactNode } from "react";

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const { user, token, authenticated } = useAuthState();

    return (
        <AppContext.Provider value={{ user, token, authenticated }}>
            {children}
        </AppContext.Provider>
    );
};
