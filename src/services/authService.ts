
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

  async login(email: string, password: string): Promise<LoginResponse> {
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
        // Store token securely
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

  async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

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

  private setAuthToken(token: string): void {
    // Use sessionStorage for better security than localStorage
    sessionStorage.setItem('auth_token', token);
    sessionStorage.setItem('auth_timestamp', Date.now().toString());
  }

  getAuthToken(): string | null {
    const token = sessionStorage.getItem('auth_token');
    const timestamp = sessionStorage.getItem('auth_timestamp');
    
    // Token expires after 8 hours
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
