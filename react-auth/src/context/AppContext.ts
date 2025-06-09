import { createContext } from "react";
import type { User } from "../types.ts";

export type AppContextType = {
    user: User | null | undefined;
    token: string | null | undefined;
    authenticated: boolean;
};

export const AppContext = createContext<AppContextType | undefined | null>(undefined);
