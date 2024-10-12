"use client";

import {useChannelId} from "@/hooks/use-channel-id";
import {useGetChannel} from "@/features/channels/api/use-get-channel";
import {Loader, TriangleAlert} from "lucide-react";
import {Header} from "./header";
import {ChatInput} from "./chat-input";
import {useGetMessages} from "@/features/messages/use-get-messages";

const ChannelPage = () => {
    const channelId = useChannelId();

    const { results } = useGetMessages({channelId});
    const {data: channel, isLoading: channelLoading} = useGetChannel({id: channelId});

    if (channelLoading) {
        return (
            <div className="h-full flex-1 flex items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground"/>
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
                <TriangleAlert className="size-5 animate-bounce text-muted-foreground"/>
                <span className="text-sm text-muted-foreground">Channel not found</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <Header title={channel.name}/>
            <div className="flex-1">
                {JSON.stringify(results, null, 2)}
            </div>
            <ChatInput placeholder={`Message: # ${channel.name}`}/>
        </div>
    )
}

export default ChannelPage;
