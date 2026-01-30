'use client';

import { useState } from 'react';
import { Check, Circle, ClipboardList } from 'lucide-react';

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

interface ChecklistProps {
    items: ChecklistItem[];
}

export default function Checklist({ items: initialItems }: ChecklistProps) {
    const [items, setItems] = useState<ChecklistItem[]>(initialItems);

    const toggleItem = (id: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    };

    const completedCount = items.filter((item) => item.completed).length;
    const progress = (completedCount / items.length) * 100;

    return (
        <div className="glass rounded-xl p-4 border border-amber-500/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <ClipboardList size={14} className="text-amber-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-amber-400">
                        Requirements Checklist
                    </h4>
                </div>
                <span className="text-xs text-slate-400">
                    {completedCount}/{items.length} completed
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-slate-700 rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Items */}
            <div className="space-y-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200 text-left group ${item.completed
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20'
                                : 'hover:bg-slate-700/50'
                            }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${item.completed
                                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                                    : 'border-2 border-slate-500 group-hover:border-slate-400'
                                }`}
                        >
                            {item.completed ? (
                                <Check size={12} className="text-white" />
                            ) : (
                                <Circle size={8} className="text-transparent" />
                            )}
                        </div>
                        <span
                            className={`text-sm transition-all duration-200 ${item.completed
                                    ? 'text-slate-400 line-through'
                                    : 'text-slate-200'
                                }`}
                        >
                            {item.text}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
