import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface ChatBubbleProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    buttonRef: React.RefObject<HTMLButtonElement>;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ isOpen, onClose, children, buttonRef }) => {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatLogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [chatLog, isLoading]);

    if (!isOpen) return null;

    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const styles: React.CSSProperties = {
        position: 'absolute',
        top: buttonRect ? buttonRect.bottom + window.scrollY + 10 : '50%', // 10px below the button
        left: buttonRect ? buttonRect.left - 200 : '50%',
        zIndex: 1000,
    };

    const handleSend = async () => {
        if (message.trim() === '') return;

        setIsLoading(true);
        setMessage('');

        // Add the user's message to the chat log
        setChatLog(prevLog => [...prevLog, `You: ${message}`]);

        try {
            const response = await fetch('/api/chatgpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            setChatLog(prevLog => [...prevLog, `ChatGPT: ${data.reply}`]);
        } catch (error) {
            if (error instanceof Error) {
                setChatLog(prevLog => [...prevLog, `Error: ${error.message}`]);
            } else {
                setChatLog(prevLog => [...prevLog, 'An unknown error occurred']);
            }
        }


        setIsLoading(false);
    };

    return (
        <div style={styles} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative">
            <button onClick={onClose} className="absolute top-0 right-0 m-4 text-black dark:text-white">X</button>
            <h2 className="text-xl font-bold mb-4">Ask a question:</h2>
            <div ref={chatLogRef} className="chat-log mb-4 max-h-60 overflow-y-auto">
                {chatLog.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
                {isLoading && <p className='italic'>typing...</p>}
            </div>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Type your message..."
                    disabled={isLoading}
                />
                <button onClick={handleSend} className={`font-bold py-2 px-4 rounded mt-2 ${isLoading || message === '' ? 'bg-gray-500 text-gray-200' : 'bg-blue-500 hover:bg-blue-700 text-white'
                    }`}
                    disabled={isLoading}>
                    {'Send'}
                </button>
            </div>
        </div>
    );
};

export default ChatBubble;
