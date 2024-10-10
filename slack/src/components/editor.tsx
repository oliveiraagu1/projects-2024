import {MutableRefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {PiTextAa} from "react-icons/pi";
import Quill, {QuillOptions} from 'quill';
import {Button} from "@/components/ui/button";
import {ImageIcon, Smile} from "lucide-react";
import {MdSend} from "react-icons/md";
import {Hint} from './hint';
import {Delta, Op} from "quill/core";

import "quill/dist/quill.snow.css";
import {Simulate} from "react-dom/test-utils";
import {cn} from "@/lib/utils";
import container from "parchment/src/blot/abstract/container";
import Toolbar from "quill/modules/toolbar";
import {EmojiPopover} from "@/components/emoji-popover";


type EditorValue = {
    image: File | null;
    body: string;
}

interface EditorProps {
    onSubmit: ({image, body}: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
    variant?: "create" | "update";
}

const Editor = ({
                    variant = "create",
                    onCancel,
                    onSubmit,
                    placeholder = "Write something...",
                    defaultValue = [],
                    disabled = false,
                    innerRef
                }: EditorProps) => {
    const [text, setText] = useState("");
    const [isToolbarVisible, setToolbarVisible] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div"),
        );

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "strike"],
                    ["link"],
                    [{list: "ordered"}, {list: "bullet"}],
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                return;
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n");
                            }
                        }
                    }
                }
            }

        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus();

        if (innerRef) {
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        })


        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (container) {
                container.innerHTML = "";
            }

            if (quillRef.current) {
                quillRef.current = null;
            }

            if (innerRef) {
                innerRef.current = null;
            }
        };

    }, [innerRef]);

    const toggleToolbar = () => {
        setToolbarVisible((current) => !current);
        const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

        if (toolbarElement) {
            toolbarElement.classList.toggle("hidden");
        }
    }

    const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current;

        quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300
                focus-within:shadow-sm transition bg-white"
            >
                <div ref={containerRef} className="h-full ql-custom"/>
                <div className="flex px-2 pb-2 z-[5]">
                    <Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
                        <Button
                            disabled={disabled}
                            size="iconSm"
                            variant="ghost"
                            onClick={toggleToolbar}
                        >
                            <PiTextAa className="size-4"/>
                        </Button>
                    </Hint>
                    <EmojiPopover onEmojiSelect={onEmojiSelect}>
                        <Button
                            disabled={disabled}
                            size="iconSm"
                            variant="ghost"
                        >
                            <Smile className="size-4"/>
                        </Button>
                    </EmojiPopover>
                    {variant === "create" && (
                        <Hint label="Image">
                            <Button
                                disabled={disabled}
                                size="iconSm"
                                variant="ghost"
                                onClick={() => {
                                }}
                            >
                                <ImageIcon className="size-4"/>
                            </Button>
                        </Hint>
                    )}
                    {variant === "update" && (
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                }}
                                disabled={disabled}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                }}
                                disabled={disabled || isEmpty}
                                size="sm"
                                className="bg-[#007A5A] hover:bg-[#007A5A]/80 text-white"
                            >
                                Save
                            </Button>
                        </div>
                    )}

                    {variant === "create" && (
                        <Button
                            disabled={disabled || isEmpty}
                            onClick={() => {
                            }}
                            size="iconSm"
                            className={cn(
                                "ml-auto",
                                isEmpty
                                    ? "bg-white hover:bg-white text-muted-foreground"
                                    : "bg-[#007A5A] hover:bg-[#007A5A]/80 text-white"
                                ,
                            )}
                        >
                            <MdSend className="size-4"/>
                        </Button>
                    )}
                </div>
            </div>
            {variant === 'create' && (
                <div className={cn(
                    "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
                    !isEmpty && "opacity-100",

                )}>
                    <p>
                        <strong>Shift + Return</strong> to add a new line
                    </p>
                </div>
            )}
        </div>
    )
}

export default Editor;