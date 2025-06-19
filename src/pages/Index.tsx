
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { Header } from "@/components/Header";

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

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Olá! Eu sou o agente de marca da No Ponto. Como posso ajudá-lo hoje?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        content: "Olá! Eu sou o agente de marca da No Ponto. Como posso ajudá-lo hoje?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setCurrentConversationId(null);
  };

  const addMessage = (message: Message) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      
      // Se é a primeira pergunta do usuário e não temos uma conversa atual
      if (message.sender === 'user' && currentConversationId === null) {
        const newConversation: Conversation = {
          id: Date.now(),
          title: message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content,
          time: 'Agora',
          messages: newMessages
        };
        
        setConversations(prevConversations => [newConversation, ...prevConversations]);
        setCurrentConversationId(newConversation.id);
      } else if (currentConversationId !== null) {
        // Atualizar a conversa existente
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.id === currentConversationId 
              ? { ...conv, messages: newMessages, time: 'Agora' }
              : conv
          )
        );
      }
      
      return newMessages;
    });
  };

  const loadConversation = (conversationId: number) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(conversationId);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 h-screen flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={clearChat}
        conversations={conversations}
        onLoadConversation={loadConversation}
        currentConversationId={currentConversationId}
      />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <ChatArea 
          messages={messages}
          onAddMessage={addMessage}
        />
      </div>
    </div>
  );
};

export default Index;
