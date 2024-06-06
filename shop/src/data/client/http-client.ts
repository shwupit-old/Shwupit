import type { SearchParamOptions, Attachment } from '@/types';
import axios from 'axios';
import Router from 'next/router';
import { getAuthToken, removeAuthToken } from './token.utils';

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});
Axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token ? token : ''}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      removeAuthToken();
      Router.reload();
    }
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

class HttpClient {
  static async get<T>(url: string, params?: unknown): Promise<T> {
    try {
      const response = await Axios.get<T>(url, { params });
      return response.data;
    } catch (error) {
      console.error('GET request error:', error);
      throw error;
    }
  }

  static async post<T>(url: string, data: unknown, options?: any): Promise<T> {
    try {
      const response = await Axios.post<T>(url, data, options);
      return response.data;
    } catch (error) {
      console.error('POST request error:', error);
      throw error;
    }
  }

  static async put<T>(url: string, data: unknown): Promise<T> {
    try {
      const response = await Axios.put<T>(url, data);
      return response.data;
    } catch (error) {
      console.error('PUT request error:', error);
      throw error;
    }
  }

  static async delete<T>(url: string): Promise<T> {
    try {
      const response = await Axios.delete<T>(url);
      return response.data;
    } catch (error) {
      console.error('DELETE request error:', error);
      throw error;
    }
  }

  static async uploadAttachments(files: File[]): Promise<Attachment[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('image', file);
    });

    try {
      const response = await Axios.post<Attachment[]>('/attachments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  static async register(userData: { username: string; email: string; password: string }) {
    return this.post('/register', userData);
  }

  static async login(credentials: { username: string; password: string }) {
    return this.post('/login', credentials);
  }

  static async logout() {
    return this.post('/logout', {});
  }

  static formatSearchParams(params: Partial<SearchParamOptions>) {
    return Object.entries(params)
      .filter(([, value]) => Boolean(value))
      .map(([k, v]) =>
        ['type', 'categories', 'tags', 'author', 'manufacturer'].includes(k)
          ? `${k}.slug:${v}`
          : `${k}:${v}`
      )
      .join(';');
  }
}

export { HttpClient };