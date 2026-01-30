import { User, Sparkles, Info } from 'lucide-react';
import Checklist, { ChecklistItem } from './Checklist';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    checklist?: ChecklistItem[];
    explanation?: string;
    timestamp: Date;
}

interface ChatBubbleProps {
    message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div
            className={`flex gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : ''
                }`}
        >
            {/* Avatar */}
            <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isUser
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-br from-primary-500 to-purple-500'
                    }`}
            >
                {isUser ? (
                    <User size={16} className="text-white" />
                ) : (
                    <Sparkles size={16} className="text-white" />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[85%] ${isUser ? 'flex flex-col items-end' : ''}`}>
                <div
                    className={`rounded-2xl px-4 py-3 ${isUser
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 rounded-tr-sm text-white'
                            : 'glass-lighter rounded-tl-sm'
                        }`}
                >
                    <p className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-slate-200'}`}>
                        {message.content}
                    </p>
                </div>

                {/* Checklist */}
                {!isUser && message.checklist && message.checklist.length > 0 && (
                    <div className="mt-3 w-full">
                        <Checklist items={message.checklist} />
                    </div>
                )}

                {/* Explanation Box */}
                {!isUser && message.explanation && (
                    <div className="mt-3 w-full glass rounded-xl p-4 border border-primary-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                <Info size={14} className="text-primary-400" />
                            </div>
                            <h4 className="text-sm font-semibold text-primary-400">
                                Explanation
                            </h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {message.explanation}
                        </p>
                    </div>
                )}

                {/* Timestamp */}
                <p
                    className={`text-xs text-slate-500 mt-2 ${isUser ? 'text-right' : 'text-left'
                        }`}
                >
                    {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </div>
    );
}
