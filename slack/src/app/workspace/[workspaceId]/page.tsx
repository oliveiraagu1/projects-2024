interface WorkSpaceIdPageProps {
    params: {
        workspaceId: string;
    }
}

const WorkSpaceIdPage = ({ params }: WorkSpaceIdPageProps) => {

    console.log(params.workspaceId);

    return (
        <div>
            ID: {params.workspaceId}
        </div>
    )
}

export default WorkSpaceIdPage;