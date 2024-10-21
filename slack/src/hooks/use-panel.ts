import {useParentMessageId} from "@/features/messages/store/use-parent-message-id";

export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId();

    const onOpenMessage = async (messageId: string) => {
        await setParentMessageId(messageId);
    }

    const onClose = async () => {
        await setParentMessageId(null);
    }

    return {
        parentMessageId,
        onOpenMessage,
        onClose
    }
}