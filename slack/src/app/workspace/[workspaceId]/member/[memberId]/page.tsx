"use client";

import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useMemberId} from "@/hooks/use-member-id";

const MemberIdPage = () => {
    const memberId = useMemberId();
    const workspaceId = useWorkspaceId();


    return (
        <div>
            Member
        </div>
    )
}

export default MemberIdPage;