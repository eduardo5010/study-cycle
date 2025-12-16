import { getNetworkConfig, buildApiUrl } from '../config/api';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

class ApiClient {
  private config = getNetworkConfig();

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: this.config.TIMEOUT,
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Handle JSON body
    if (finalOptions.body && typeof finalOptions.body === 'object') {
      finalOptions.body = JSON.stringify(finalOptions.body);
    }

    try {
      console.log(`🌐 API Request: ${finalOptions.method || 'GET'} ${url}`);

      const response = await fetch(url, finalOptions);
      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || `HTTP ${response.status}`,
          status: response.status,
          details: data,
        } as ApiError;
      }

      return {
        data,
        message: data.message,
        status: response.status,
      };
    } catch (error: any) {
      console.error('❌ API Error:', error);

      if (error.status) {
        throw error; // Re-throw ApiError
      }

      // Network error
      throw {
        message: 'Erro de conexão. Verifique sua internet.',
        status: 0,
        details: error,
      } as ApiError;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }

  // Set auth token for requests
  setAuthToken(token: string) {
    // This would be implemented when auth is added
    console.log('Auth token set:', token.substring(0, 10) + '...');
  }

  // Clear auth token
  clearAuthToken() {
    // This would be implemented when auth is added
    console.log('Auth token cleared');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
