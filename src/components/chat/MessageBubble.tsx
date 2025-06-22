
import { User } from "lucide-react";
import { Message } from "@/types/chat";
import { processMarkdown } from "@/utils/markdown";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div
      className={`flex items-start space-x-3 ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.sender === 'bot' && (
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <img src="no-ponto-white-16-16.png" alt="Logo No Ponto" className="w-4 h-4" />
        </div>
      )}
      <div
        className={`max-w-3xl px-4 py-3 rounded-lg ${
          message.sender === 'user'
            ? 'bg-green-500 text-white'
            : 'bg-white border border-gray-200 text-gray-900'
        }`}
      >
        {message.sender === 'bot' ? (
          <div 
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ 
              __html: processMarkdown(message.content) 
            }}
          />
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
        <div className={`text-xs mt-2 ${
          message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      {message.sender === 'user' && (
        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};
