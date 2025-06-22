
// Função para processar markdown básico
export const processMarkdown = (text: string) => {
  return text
    // Negrito **texto**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Itálico *texto*
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Código inline `código`
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    // Links [texto](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
    // Listas numeradas (simples)
    .replace(/^\d+\.\s+(.+)$/gm, '<div class="ml-4">$&</div>')
    // Listas com bullets (simples)
    .replace(/^[\-\*]\s+(.+)$/gm, '<div class="ml-4">• $1</div>');
};
