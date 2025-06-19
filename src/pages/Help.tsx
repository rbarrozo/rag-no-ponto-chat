
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Help = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "Como funciona o RAG no Ponto?",
      answer: "O RAG (Retrieval-Augmented Generation) no Ponto combina busca de informações com geração de texto para fornecer respostas mais precisas e contextualizadas sobre a marca No Ponto."
    },
    {
      id: 2,
      question: "Como posso fazer uma nova pergunta?",
      answer: "Digite sua pergunta na caixa de texto na parte inferior da tela de chat e pressione Enter ou clique no botão de enviar."
    },
    {
      id: 3,
      question: "Posso ver o histórico das minhas conversas?",
      answer: "Sim! Todas as suas conversas ficam salvas na barra lateral esquerda. Clique em qualquer conversa anterior para visualizá-la novamente."
    },
    {
      id: 4,
      question: "Como iniciar uma nova conversa?",
      answer: "Clique no botão 'Nova conversa' na barra lateral ou use o ícone de menu no topo da tela."
    },
    {
      id: 5,
      question: "O que fazer se o chatbot não entender minha pergunta?",
      answer: "Tente reformular sua pergunta de forma mais clara e específica. O sistema funciona melhor com perguntas diretas sobre a marca No Ponto."
    },
    {
      id: 6,
      question: "Posso usar o sistema em dispositivos móveis?",
      answer: "Sim! O sistema é totalmente responsivo e funciona bem em smartphones e tablets."
    }
  ];

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar ao Chat
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajuda & FAQ</h1>
          <p className="text-gray-600 mb-8">
            Encontre respostas para as perguntas mais frequentes sobre o RAG no Ponto
          </p>

          {/* FAQ Section */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaq === faq.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFaq === faq.id && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 p-6 bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Ainda precisa de ajuda?
            </h2>
            <p className="text-gray-600 mb-4">
              Se você não encontrou a resposta que procurava, entre em contato conosco.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Email:</strong> suporte@noponto.com.br</p>
              <p><strong>Telefone:</strong> (11) 1234-5678</p>
              <p><strong>Horário:</strong> Segunda a Sexta, 8h às 18h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
