import {useRouter} from "next/navigation";
import {ChangeEvent, FormEvent, useState} from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';

import { useCreateChannelModal} from "@/features/channels/store/use-create-channel-modal";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useCreateChannel} from "@/features/channels/api/use-create-channel";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {toast} from "sonner";

export const CreateChannelModal = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const {mutate, isPending} = useCreateChannel();
    const [open, setOpen] = useCreateChannelModal();

    const [name, setName] = useState("");

    const handleClose = () => {
        setName("");
        setOpen(false);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\s+/g, "-").toLowerCase();
        setName(value);
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await mutate({
            name, workspaceId
        }, {
            onSuccess(id) {
                toast.success("Channel created.");
                router.push(`/workspace/${workspaceId}/channel/${id}`);
                handleClose();
            },
            onError: () => {
                toast.error("Failed to create channel.");
            }
        })

    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        value={name}
                        disabled={isPending}
                        onChange={handleChange}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder="e.g. plan-budget"
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={isPending}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}