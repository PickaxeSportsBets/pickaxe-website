// utils/apiClient.ts
type ApiResponse<T> = {
    data?: T;
    error?: string;
  };
  
  export class ApiClient {
    private static async getToken(): Promise<string | null> {
      try {
        const response = await fetch('/api/subscription-token');
        if (!response.ok) {
          throw new Error('Failed to get token');
        }
        const { token } = await response.json();
        return token;
      } catch (error) {
        console.error('Error getting token:', error);
        return null;
      }
    }
  
    static async fetchWithToken<T>(
      url: string, 
      options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
      try {
        const token = await this.getToken();
        if (!token) {
          return { error: 'No valid subscription token' };
        }
  
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 401) {
          // Token expired - get a new one and retry
          const newToken = await this.getToken();
          if (!newToken) {
            return { error: 'Failed to refresh token' };
          }
  
          // Retry with new token
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!retryResponse.ok) {
            throw new Error(`API error: ${retryResponse.statusText}`);
          }
  
          return { data: await retryResponse.json() };
        }
  
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
  
        return { data: await response.json() };
      } catch (error) {
        console.error('API request failed:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }
  }
  
  // Example usage:
  export async function fetchProtectedContent() {
    return ApiClient.fetchWithToken('/api/protected-content');
  }