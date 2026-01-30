'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Send,
    Menu,
    Plus,
    MessageSquare,
    ChevronRight,
    Sparkles,
    Building2,
} from 'lucide-react';
import ChatBubble from '@/components/ChatBubble';
import { ChecklistItem } from '@/components/Checklist';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    checklist?: ChecklistItem[];
    explanation?: string;
    timestamp: Date;
}

interface RecentSearch {
    id: string;
    title: string;
    preview: string;
    timestamp: Date;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userId] = useState(() => `user-${Date.now()}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [recentSearches] = useState<RecentSearch[]>([
        {
            id: '1',
            title: 'Passport Renewal',
            preview: 'How to renew my passport...',
            timestamp: new Date(Date.now() - 86400000),
        },
        {
            id: '2',
            title: 'Tax Filing Help',
            preview: 'What documents do I need...',
            timestamp: new Date(Date.now() - 172800000),
        },
        {
            id: '3',
            title: 'Driver License',
            preview: 'Steps to get a new license...',
            timestamp: new Date(Date.now() - 259200000),
        },
    ]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: `msg-${Date.now()}-assistant`,
                role: 'assistant',
                content: data.reply,
                checklist: data.checklist,
                explanation: data.explanation,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: `msg-${Date.now()}-error`,
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please make sure the backend server is running and try again.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-screen bg-dark-300">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-72' : 'w-0'
                    } transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0`}
            >
                <div className="h-full w-72 glass border-r border-slate-700/50 flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-slate-700/50">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-xl text-white font-medium transition-all duration-200 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40">
                            <Plus size={20} />
                            New Chat
                        </button>
                    </div>

                    {/* Recent Searches */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Recent Searches
                        </h3>
                        <div className="space-y-2">
                            {recentSearches.map((search) => (
                                <button
                                    key={search.id}
                                    className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors group"
                                >
                                    <div className="flex items-start gap-3">
                                        <MessageSquare
                                            size={18}
                                            className="text-slate-400 mt-0.5 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-200 truncate">
                                                {search.title}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                                {search.preview}
                                            </p>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-slate-700/50">
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">U</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-200 truncate">
                                    Guest User
                                </p>
                                <p className="text-xs text-slate-500">Free Plan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 glass border-b border-slate-700/50 flex items-center px-4 gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                        <Menu size={20} className="text-slate-400" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Building2 size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-white">GavaNav</h1>
                            <p className="text-xs text-slate-400">
                                Government Service Assistant
                            </p>
                        </div>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-6 shadow-2xl shadow-primary-500/30">
                                <Sparkles size={40} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Welcome to GavaNav
                            </h2>
                            <p className="text-slate-400 max-w-md mb-8">
                                Your AI-powered assistant for navigating government services.
                                Ask me about permits, licenses, tax filings, and more.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                                {[
                                    'How do I renew my passport?',
                                    'What documents do I need for tax filing?',
                                    "How to apply for a driver's license?",
                                    'Steps to register a new business',
                                ].map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInputValue(suggestion)}
                                        className="p-4 text-left glass-lighter rounded-xl hover:bg-slate-700/60 transition-all duration-200 group"
                                    >
                                        <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                            {suggestion}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-4">
                            {messages.map((message) => (
                                <ChatBubble key={message.id} message={message} />
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 animate-fade-in">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                        <Sparkles size={16} className="text-white animate-pulse-soft" />
                                    </div>
                                    <div className="glass-lighter rounded-2xl rounded-tl-sm px-4 py-3">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 pt-0">
                    <div className="max-w-4xl mx-auto">
                        <div className="glass rounded-2xl p-2 flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask about government services..."
                                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-500 focus:outline-none"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className="p-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed rounded-xl text-white transition-all duration-200 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 disabled:shadow-none"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <p className="text-center text-xs text-slate-500 mt-3">
                            GavaNav may provide general guidance. Always verify with official government sources.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
