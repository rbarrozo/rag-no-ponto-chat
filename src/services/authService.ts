interface LoginResponse {
  success: boolean;
  token?: string;
  message: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

class AuthService {
  private readonly API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com' 
    : 'http://localhost:3002';

  // Lista fixa de usuários para teste em desenvolvimento
  private readonly TEST_USERS = [
    { email: 'admin@teste.com', password: '123456', name: 'Admin' },
    { email: 'user@teste.com', password: 'senha123', name: 'Usuário Teste' },
    { email: 'demo@teste.com', password: 'demo', name: 'Demo User' }
  ];

  async login(email: string, password: string): Promise<LoginResponse> {
    // Em desenvolvimento, usar autenticação simulada
    if (process.env.NODE_ENV !== 'production') {
      return this.simulateLogin(email, password);
    }

    // Lógica de produção
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        this.setAuthToken(data.token);
        return { success: true, token: data.token, message: 'Login realizado com sucesso' };
      } else {
        return { success: false, message: data.message || 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro de conexão. Tente novamente.' };
    }
  }

  private simulateLogin(email: string, password: string): Promise<LoginResponse> {
    return new Promise((resolve) => {
      // Simular delay de rede
      setTimeout(() => {
        const user = this.TEST_USERS.find(u => u.email === email && u.password === password);
        
        if (user) {
          const fakeToken = `fake-jwt-token-${Date.now()}`;
          this.setAuthToken(fakeToken);
          resolve({ 
            success: true, 
            token: fakeToken, 
            message: `Login simulado realizado com sucesso para ${user.name}` 
          });
        } else {
          resolve({ 
            success: false, 
            message: 'Credenciais inválidas. Use: admin@teste.com/123456 ou user@teste.com/senha123' 
          });
        }
      }, 800); // Simular 800ms de delay
    });
  }

  async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    // Em desenvolvimento, simular respostas da API
    if (process.env.NODE_ENV !== 'production') {
      return this.simulateApiRequest(endpoint, options);
    }

    // Lógica de produção
    try {
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        this.clearAuth();
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error('Erro na requisição autenticada:', error);
      throw error;
    }
  }

  private simulateApiRequest(endpoint: string, options: RequestInit): Promise<ApiResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint === '/ask' && options.method === 'POST') {
          const responses = [
            'Esta é uma resposta simulada do chatbot para ambiente de desenvolvimento.',
            'Olá! Estou funcionando em modo de teste. Como posso ajudá-lo hoje?',
            'Esta é uma simulação. Em produção, eu me conectaria com a API real.',
            'Resposta de teste: Tudo funcionando perfeitamente no ambiente de desenvolvimento!'
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          resolve({
            success: true,
            data: {
              answer: {
                content: randomResponse
              }
            },
            message: 'Resposta simulada gerada com sucesso'
          });
        } else {
          resolve({
            success: true,
            data: { message: 'Endpoint simulado' },
            message: 'Requisição simulada processada'
          });
        }
      }, 1000); // Simular 1 segundo de delay
    });
  }

  private setAuthToken(token: string): void {
    sessionStorage.setItem('auth_token', token);
    sessionStorage.setItem('auth_timestamp', Date.now().toString());
  }

  getAuthToken(): string | null {
    const token = sessionStorage.getItem('auth_token');
    const timestamp = sessionStorage.getItem('auth_timestamp');
    
    if (token && timestamp) {
      const tokenAge = Date.now() - parseInt(timestamp);
      const EIGHT_HOURS = 8 * 60 * 60 * 1000;
      
      if (tokenAge > EIGHT_HOURS) {
        this.clearAuth();
        return null;
      }
      
      return token;
    }
    
    return null;
  }

  clearAuth(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_timestamp');
    sessionStorage.removeItem('userEmail');
  }

  isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  }
}

export const authService = new AuthService();
