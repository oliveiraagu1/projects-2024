"use client";

import {Provider} from 'jotai';
import {ReactNode} from "react";

interface JotProviderProps {
    children: ReactNode;
}

export const JotProvider = ({children}: JotProviderProps) => {
    return (
        <Provider>
            {children}
        </Provider>
    )
}