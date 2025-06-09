import {useContext} from "react";
import {AppContext} from "../context/AppContext.ts";

export const useAppContext = () => {
    return useContext(AppContext);
};
