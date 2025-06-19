
import { useState } from "react";
import { Plus, MessageCircle, User, HelpCircle, Bot, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { AccountModal } from "./AccountModal";

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Conversation {
  id: number;
  title: string;
  time: string;
  messages: Message[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  conversations: Conversation[];
  onLoadConversation: (conversationId: number) => void;
  currentConversationId: number | null;
}

export const Sidebar = ({ 
  isOpen, 
  onToggle, 
  onNewChat, 
  conversations, 
  onLoadConversation, 
  currentConversationId 
}: SidebarProps) => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNewChat = () => {
    onNewChat();
  };

  const handleLoadConversation = (conversationId: number) => {
    onLoadConversation(conversationId);
  };

  const handleAccountClick = () => {
    setIsAccountModalOpen(true);
  };

  const handleHelpClick = () => {
    navigate("/help");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4 flex flex-col z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:p-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <Bot className="w-4 h-4" />
            </div>
            <span className="font-semibold">RAG no Ponto</span>
          </div>
          <button 
            onClick={onToggle}
            className="md:hidden p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <button 
          onClick={handleNewChat}
          className="flex items-center p-3 rounded-md hover:bg-gray-700 mb-4 transition-colors"
        >
          <Plus className="w-4 h-4 mr-3" />
          <span>Nova conversa</span>
        </button>

        {/* Conversations History */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 && (
            <>
              <div className="text-gray-400 text-sm mb-2 px-3">Conversas Recentes</div>
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button 
                    key={conv.id}
                    onClick={() => handleLoadConversation(conv.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-md hover:bg-gray-700 flex items-center group transition-colors",
                      currentConversationId === conv.id ? "bg-gray-700" : ""
                    )}
                  >
                    <MessageCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="truncate text-sm block">{conv.title}</span>
                      <span className="text-xs text-gray-400">{conv.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-700 space-y-1">
          <button 
            onClick={handleAccountClick}
            className="w-full text-left p-3 rounded-md hover:bg-gray-700 flex items-center transition-colors"
          >
            <User className="w-4 h-4 mr-3" />
            <span>Minha conta</span>
          </button>
          <button 
            onClick={handleHelpClick}
            className="w-full text-left p-3 rounded-md hover:bg-gray-700 flex items-center transition-colors"
          >
            <HelpCircle className="w-4 h-4 mr-3" />
            <span>Ajuda & FAQ</span>
          </button>
        </div>
      </div>

      {/* Account Modal */}
      <AccountModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
      />
    </>
  );
};
