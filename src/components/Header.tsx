
import { Bot, Menu } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="border-b border-gray-200 p-4 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden mr-3 p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="font-semibold text-lg">No Ponto | Agente de Marca</h1>
          <p className="text-sm text-gray-600">Assistente inteligente com RAG</p>
        </div>
      </div>
    </header>
  );
};
