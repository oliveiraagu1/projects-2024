import {Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {CopyIcon, RefreshCcw} from "lucide-react";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {toast} from "sonner";
import {useNewJoinCode} from "@/features/workspaces/api/use-new-join-code";
import {useConfirm} from "@/hooks/use-confirm";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
}


export const InviteModal = ({open, setOpen, name, joinCode}: InviteModalProps) => {
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This will deactivate the current invite ode and generate a new one."
    );

    const {mutate, isPending} = useNewJoinCode();

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => toast.success("Invite link copied to clipboard"))
        ;
    }

    const handleNewCode = async () => {
        const ok = await confirm();

        if (!ok) return;

        await mutate({workspaceId}, {
            onSuccess: () => {
                toast.success("Invite code regenerated successfully.");
            },
            onError: () => {
                toast.error("Invite code regenerated failed");
            }
        });
    }

    return (
        <>
            <ConfirmDialog/>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite people to your {name}</DialogTitle>
                        <DialogDescription>
                            Use the code below to invite people to your workspace
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                        <p className="text-4xl font-bold tracking-widest uppercase">
                            {joinCode}
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                        >
                            Copy Link
                            <CopyIcon className="size-4 ml-2"/>
                        </Button>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isPending}
                            variant="outline"
                            onClick={handleNewCode}
                        >
                            New code
                            <RefreshCcw className="size-4 ml-2"/>
                        </Button>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
