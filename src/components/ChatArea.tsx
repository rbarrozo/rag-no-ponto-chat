import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeHtml, sanitizeInput } from "@/utils/sanitize";
import { authService } from "@/services/authService";

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  onAddMessage: (message: Message) => void;
}

export const ChatArea = ({ messages, onAddMessage }: ChatAreaProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Sanitize user input
    const sanitizedInput = sanitizeInput(inputValue);
    
    if (!sanitizedInput) {
      return;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      content: sanitizedInput,
      sender: 'user',
      timestamp: new Date()
    };

    onAddMessage(newMessage);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await authService.makeAuthenticatedRequest('/ask', {
        method: 'POST',
        body: JSON.stringify({ question: sanitizedInput }),
      });


		if (response.success && response.data) {
			
			console.log(response.data)
			//console.log(response.data)
			const responseText = response.data.answer || "Desculpe, não consegui entender.";
			
			// Sanitize the response to prevent XSS
			const cleanText = sanitizeHtml(responseText)
			  .replace(/\*\*(.*?)\*\*/g, "$1")  // remove negrito markdown **texto**
			  .replace(/\*(.*?)\*/g, "$1");     // remove itálico markdown *texto*

			// Criar resposta real do bot
			const botResponse: Message = {
			  id: messages.length + 3,
			  content: cleanText,
			  sender: 'bot',
			  timestamp: new Date()
			};
			
			onAddMessage(botResponse);
			
      } else {
        throw new Error(response.message || 'Erro na resposta da API');
      }
    } catch (err) {
      console.error("Erro ao chamar API:", err);
      
      let errorMessage = "Ocorreu um erro. Tente novamente.";
      if (err instanceof Error && err.message.includes('Sessão expirada')) {
        errorMessage = "Sua sessão expirou. Você será redirecionado para o login.";
        // The authService will handle the redirect
      }
      
      const errorResponse: Message = {
        id: messages.length + 3,
        content: errorMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      onAddMessage(errorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
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
              <p className="whitespace-pre-wrap">{message.content}</p>
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
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="min-h-[60px] max-h-32 resize-none border-gray-300 focus:border-green-500 focus:ring-green-500"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 h-[60px]"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Pressione Enter para enviar, Shift+Enter para quebrar linha
          </div>
        </div>
      </div>
    </div>
  );
};
