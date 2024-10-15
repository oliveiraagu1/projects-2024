import dynamic from "next/dynamic";
import {Doc, Id} from "../../convex/_generated/dataModel";
import {format, isToday, isYesterday} from "date-fns";
import {Hint} from "@/components/hint";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Thumbnail} from "@/components/thumbnail";
import {Toolbar} from "@/components/toolbar";
import {useUpdateMessage} from "@/features/messages/api/use-update-message";
import {toast} from "sonner";
import {cn} from "@/lib/utils";
import {useRemoveMessage} from "@/features/messages/api/use-remove-message";
import {useConfirm} from "@/hooks/use-confirm";

const Renderer = dynamic(() => import("@/components/renderer"), {ssr: false});
const Editor = dynamic(() => import("@/components/editor"), {ssr: false});

interface Reaction {
    _id: Id<"reactions">;
    _creationTime: number;
    workspaceId: Id<"workspaces">;
    memberId: Id<"members">;
    messageId: Id<"messages">;
    values: string;
    count: number;
    memberIds: Id<"members">[];
}

interface MessageProps {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions: [index: number, array: Reaction[]][];
    body: Doc<"messages">["body"];
    image: string | null | undefined;
    createdAt: Doc<"messages">["_creationTime"];
    updatedAt: Doc<"messages">["updatedAt"];
    isEditing: boolean;
    isCompact?: boolean;
    setEditing: (id: Id<"messages"> | null) => void;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "H:mm:ss a")}`;
}

export const Message = ({
                            id,
                            isAuthor,
                            memberId,
                            authorImage,
                            authorName = "Member",
                            reactions,
                            body,
                            image,
                            createdAt,
                            updatedAt,
                            isEditing,
                            isCompact,
                            setEditing,
                            hideThreadButton,
                            threadCount,
                            threadImage,
                            threadTimestamp,
                        }: MessageProps) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete message",
        "Are you sure you want to delete message? This cannot be undone"
    );

    const {mutate: updateMessage, isPending: isUpdatingMessage} = useUpdateMessage();
    const {mutate: removeMessage, isPending: isRemovingMessage} = useRemoveMessage();

    const isPending = isUpdatingMessage;

    const handleRemove = async () => {
        const ok = await confirm();

        if (!ok) return;

        await removeMessage({id}, {
            onSuccess: () => {
                toast.success("Message Deleted");
            },
            onError: () => {
                toast.error("Failed to delete message");
            }
        })
    }

    const handleUpdate = async ({body}: { body: string }) => {
        await updateMessage({id, body}, {
            onSuccess: () => {
                toast.success("Message updated successfully.");
                setEditing(null);
            },
            onError: () => {
                toast.error("Message updated failed");
            }
        })
    }

    if (isCompact) {
        return (
            <>
                <ConfirmDialog/>
                <div className={cn(
                    "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                    isEditing && "bg-[#F2C74433] hover:bg-[#F2C74433]",
                    isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                )}>
                    <div className="flex items-center gap-2">
                        <Hint label={formatFullTime(new Date(createdAt))}>
                            <button
                                className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                                {format(new Date(createdAt), "H:mm")}
                            </button>
                        </Hint>
                        {isEditing ? (
                            <div className="w-full h-full">
                                <Editor
                                    onSubmit={handleUpdate}
                                    disabled={isPending}
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() => setEditing(null)}
                                    variant="update"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <Renderer value={body}/>
                                <Thumbnail url={image}/>
                                {updatedAt ? (
                                    <span className="text-xs text-muted-foreground">(edited)</span>
                                ) : null}
                            </div>
                        )}
                    </div>
                    {!isEditing && (
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => setEditing(id)}
                            handleThread={() => {
                            }}
                            handleDelete={handleRemove}
                            handleReaction={() => {
                            }}
                            hideThreadButton={hideThreadButton}
                        />
                    )}
                </div>
            </>
        )
    }

    const avatarFallback = authorName.charAt(0).toUpperCase();

    return (
        <>
            <ConfirmDialog/>
            <div className={cn(
                "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                isEditing && "bg-[#F2C74433] hover:bg-[#F2C74433]",
                isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
            )}>
                <div className="flex items-start gap-2">
                    <button>
                        <Avatar>
                            <AvatarImage src={authorImage}/>
                            <AvatarFallback>
                                {avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {isEditing ? (
                        <div className="w-full h-full">
                            <Editor
                                onSubmit={handleUpdate}
                                disabled={isPending}
                                defaultValue={JSON.parse(body)}
                                onCancel={() => setEditing(null)}
                                variant="update"

                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full overflow-hidden">
                            <div className="text-sm">
                                <button onClick={() => {
                                }} className="font-bold text-primary hover:underline">
                                    {authorName}
                                </button>
                                <span>&nbsp;&nbsp;</span>
                                <Hint label={formatFullTime(new Date(createdAt))}>
                                    <button className="text-xs text-muted-foreground hover:underline">
                                        {format(new Date(createdAt), "H:mm a")}
                                    </button>
                                </Hint>
                            </div>
                            <Renderer value={body}/>
                            <Thumbnail url={image}/>
                            {updatedAt ? (
                                <span className="text-xs text-muted-foreground">(edited)</span>
                            ) : null}
                        </div>
                    )}
                </div>
                {!isEditing && (
                    <Toolbar
                        isAuthor={isAuthor}
                        isPending={isPending}
                        handleEdit={() => setEditing(id)}
                        handleThread={() => {
                        }}
                        handleDelete={handleRemove}
                        handleReaction={() => {
                        }}
                        hideThreadButton={hideThreadButton}
                    />
                )}
            </div>
        </>
    )
}