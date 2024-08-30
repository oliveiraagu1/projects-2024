"use client";

import {ReactNode} from "react";
import {Toolbar} from "./toolbar";
import {Sidebar} from "./sidebar";

interface WorkspaceIdLayoutProps {
    children: ReactNode;
}

const WorkspaceIdLayout = ({children}: WorkspaceIdLayoutProps) => {
    return (
        <div className="h-full">
            <Toolbar/>
            <div className='flex h-[calc(100vh-40px)]'>
                <Sidebar/>
                {children}
            </div>
        </div>
    )
}

export default WorkspaceIdLayout;