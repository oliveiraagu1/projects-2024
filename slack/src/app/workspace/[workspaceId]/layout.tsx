"use client";

import { ReactNode } from "react";
import {Toolbar} from "./toolbar";

interface WorkspaceIdLayoutProps {
    children: ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
    return(
        <div className="h-full">
            <Toolbar/>
            {children}
        </div>
    )
}

export default WorkspaceIdLayout;