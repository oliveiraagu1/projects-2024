"use client";

import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace";

const WorkSpaceIdPage = () => {
    const workspaceId = useWorkspaceId();
    const {data} = useGetWorkspace({id: workspaceId});

    return (
        <div>
            ID: {workspaceId}
        </div>
    )
}

export default WorkSpaceIdPage;