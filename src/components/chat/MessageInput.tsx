
import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/types/chat";
import { sanitizeInput } from "@/utils/sanitize";
import { authService } from "@/services/authService";

interface MessageInputProps {
  onAddMessage: (message: Message) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const MessageInput = ({ onAddMessage, isLoading, setIsLoading }: MessageInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generateUniqueId = () => {
    return Date.now() + Math.random();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Sanitize user input
    const sanitizedInput = sanitizeInput(inputValue);
    
    if (!sanitizedInput) {
      return;
    }

    const newMessage: Message = {
      id: generateUniqueId(),
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
        const responseText = response.data.answer || "Desculpe, não consegui entender.";
        
        // Sanitize the response to prevent XSS but keep basic formatting
        const cleanText = responseText;

        // Criar resposta real do bot
        const botResponse: Message = {
          id: generateUniqueId(),
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
        id: generateUniqueId(),
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
    <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="min-h-[60px] max-h-32 resize-none border-gray-300 focus:border-red-500 focus:ring-red-500"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 h-[60px]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Pressione Enter para enviar, Shift+Enter para quebrar linha
        </div>
      </div>
    </div>
  );
};
