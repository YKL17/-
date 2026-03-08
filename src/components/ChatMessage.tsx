import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-4",
        role === 'user' ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          role === 'user'
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700"
        )}
      >
        <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown 
                components={{
                    p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
