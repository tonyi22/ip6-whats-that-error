import { useTranslation } from '@/app/TranslationContext';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { MdCancel } from 'react-icons/md';

interface ChatBubbleProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef: React.RefObject<HTMLButtonElement>;
    activeStepRef?: React.RefObject<HTMLDivElement>;
    textBubbleRef?: React.RefObject<HTMLDivElement>;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ isOpen, onClose, buttonRef, activeStepRef, textBubbleRef }) => {
    console.log("Active step:", activeStepRef)
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState<{ msg: string, isUser: boolean }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatLogRef = useRef<HTMLDivElement>(null);
    const chatBubbleRef = useRef<HTMLDivElement>(null);
    const { translate } = useTranslation();

    const handleSend = async () => {
        if (message.trim() === '') return;

        setChatLog(prevLog => [...prevLog, { msg: message, isUser: true }]);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatgpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (response.ok) {
                const data = await response.json();
                setChatLog(prevLog => [...prevLog, { msg: data.reply, isUser: false }]);
            } else {
                setChatLog(prevLog => [...prevLog, { msg: `Something went wrong: ${response.status.toString()}`, isUser: false }]);
            }
        } catch (error) {
            if (error instanceof Error) {
                setChatLog(prevLog => [...prevLog, { msg: `Error: ${error.message}`, isUser: false }]);
            } else {
                setChatLog(prevLog => [...prevLog, { msg: 'An unknown error occurred', isUser: false }]);
            }
        }

        setIsLoading(false);
    };



    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [chatLog, isLoading]);

    useEffect(() => {
        const updateChatBubblePosition = () => {
            if (chatBubbleRef.current && buttonRef.current) {
                const buttonRect = buttonRef.current.getBoundingClientRect();
                const textBubbleRect = textBubbleRef?.current?.getBoundingClientRect();

                if (activeStepRef?.current && textBubbleRect !== undefined) {
                    // here in wizard
                    const stepTitle = activeStepRef.current.dataset.stepTitle ?? '';
                    const stepTitles = ["preventativeMeasures", "affectedSystems", "additionalInfoDescription"];
                    if (stepTitles.includes(stepTitle)) {
                        chatBubbleRef.current.style.left = `${buttonRect.left - chatBubbleRef.current.offsetWidth - 435}px`;
                    } else {
                        chatBubbleRef.current.style.left = `${buttonRect.left + buttonRect.width}px`;
                    }
                    chatBubbleRef.current.style.top = `${textBubbleRect?.top + window.scrollY - 40}px`;
                } else {
                    // this is correct
                    chatBubbleRef.current.style.top = `${buttonRect.bottom + window.scrollY + 17}px`;
                    chatBubbleRef.current.style.left = `${buttonRect.left + window.scrollX - 213}px`;
                }
            }
        };

        if (isOpen) {
            updateChatBubblePosition();
        }

        window.addEventListener('resize', updateChatBubblePosition);
        window.addEventListener('scroll', updateChatBubblePosition);

        return () => {
            window.removeEventListener('resize', updateChatBubblePosition);
            window.removeEventListener('scroll', updateChatBubblePosition);
        };
    }, [isOpen, activeStepRef, buttonRef]);

    if (!isOpen) return null;

    return (
        <div ref={chatBubbleRef} style={{ position: activeStepRef?.current ? 'absolute' : 'fixed', zIndex: 1000 }} className="dark:bg-gray-800 p-6 rounded-lg shadow-md w-96 border border-gray-300 bg-gradient-to-b from-gray-50 to-white">
            <button type="button" className="absolute top-0 right-0 m-4 text-black dark:text-white" onClick={onClose}>
                <MdCancel className="w-4 h-4 text-gray-700" />
            </button>
            <h2 className="text-xl font-bold mb-4">{translate("ask")}:</h2>
            <div ref={chatLogRef} className="chat-log mb-4 max-h-60 overflow-y-auto">
                {chatLog.map((log, index) => (
                    <div key={index} className={`mb-4 ${log.isUser ? 'text-right' : 'text-left'}`}>
                        <div className={`text-xs mb-1 ${log.isUser ? 'text-right text-gray-500' : 'text-left text-gray-500'}`}>
                            {log.isUser ? translate("you") : 'GPT'}
                        </div>
                        <div className={`inline-block px-4 py-2 rounded-lg break-words text-sm ${log.isUser ? 'bg-black text-white self-end' : 'bg-gray-300 text-black self-start'} max-w-xs`}>
                            {log.msg}
                        </div>
                    </div>
                ))}
                {isLoading && <p className='italic text-left text-sm'>{translate("writing")}</p>}
            </div>
            <div>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 border rounded mb-4 resize-none text-sm"
                    placeholder={translate("typeYourMessage")}
                    disabled={isLoading}
                    rows={2}
                />
                <button onClick={handleSend} className={`font-bold py-2 px-4 rounded w-full ${isLoading ? 'bg-gray-500 text-gray-200' : 'bg-blue-500 hover:bg-blue-700 text-white'}`} disabled={isLoading}>
                    {translate("send")}
                </button>
            </div>
        </div>
    );
};

export default ChatBubble;
