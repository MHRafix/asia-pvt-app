'use client';

import { ApiResponse } from './types';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`[API Error] ${endpoint}:`, data);
      }

      return data as ApiResponse<T>;
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.fetch<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
