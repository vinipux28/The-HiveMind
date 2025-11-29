"use client";
// This is a client component

import React, { useState, useCallback } from 'react';

// The URL for the Next.js Route Handler
const NEXTJS_API_URL = '/api/chat';

type ChatMessage = {
    sender: 'user' | 'ai' | 'system';
    text: string;
    isStreaming?: boolean;
};

export default function ChatUI() {
    const [message, setMessage] = useState<string>('');
    const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage: ChatMessage = { sender: 'user', text: message };
        setChatLog(prev => [...prev, userMessage, { sender: 'ai', text: '', isStreaming: true } as ChatMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            // 1. Send the message to the Next.js API Proxy
            const response = await fetch(NEXTJS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message }), 
                // Note: We're not using EventSource here, but a standard fetch 
                // which allows us to read the stream using TextDecoder
            });

            if (!response.body) throw new Error('No response stream received.');
            
            // 2. Read the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            // Update the last message in the chat log (which is the AI's incomplete response)
            setChatLog(prev => {
                const newLog = [...prev];
                const aiIndex = newLog.length - 1;
                let buffer = ''; // Buffer to collect chunks until a complete SSE message

                // Function to process the raw stream chunks
                const processStream = async () => {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            newLog[aiIndex].isStreaming = false;
                            setChatLog([...newLog]);
                            setIsLoading(false);
                            break;
                        }

                        // 3. Process the raw bytes from the stream
                        buffer += decoder.decode(value, { stream: true });
                        let messageEndIndex;

                        // Loop to handle multiple SSE messages in one chunk
                        while ((messageEndIndex = buffer.indexOf('\n\n')) !== -1) {
                            const event = buffer.substring(0, messageEndIndex);
                            buffer = buffer.substring(messageEndIndex + 2); // Remove message and two newlines

                            // Extract the 'data:' part from the SSE format
                            if (event.startsWith('data:')) {
                                const token = event.substring(5).trim();
                                // Append the new token to the AI message
                                newLog[aiIndex].text += token;
                                setChatLog([...newLog]);
                            }
                        }
                    }
                };

                processStream();
                return newLog;
            });

        } catch (error) {
            console.error('Client streaming error:', error);
            setIsLoading(false);
            setChatLog(prev => [...prev, { sender: 'system', text: 'Error: Could not connect to the AI service.', isStreaming: false } as ChatMessage]);
        }
    }, [message]);

    return (
        <div className="chat-container">
            {chatLog.map((msg, index) => (
                <p key={index} className={msg.sender}>
                    <strong>{msg.sender === 'user' ? 'You:' : 'AI:'}</strong> {msg.text}
                    {msg.isStreaming && <span className="typing-indicator">...</span>}
                </p>
            ))}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Ask the AI a question..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>Send</button>
            </form>
        </div>
    );
}
