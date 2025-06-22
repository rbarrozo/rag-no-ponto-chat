
export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatAreaProps {
  messages: Message[];
  onAddMessage: (message: Message) => void;
}
