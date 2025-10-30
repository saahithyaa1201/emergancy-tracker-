// lib/api.ts - React Native API Service

const API_URL = 'http://localhost:3000/api'; // For Android emulator use: http://10.0.2.2:3000/api

export interface SignUpResponse {
  message: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface SignInResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      console.log('Making request to:', url);
      const response = await fetch(url, config);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error(error.message || 'Network error. Please try again.');
    }
  }

  async signUp(email: string, password: string, fullName: string): Promise<SignUpResponse> {
    return this.request<SignUpResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
  }

  async signIn(email: string, password: string): Promise<SignInResponse> {
    return this.request<SignInResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
}

export const api = new ApiService();