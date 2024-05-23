import type { SearchParamOptions } from '@/types';
import axios from 'axios';
import Router from 'next/router';
import { getAuthToken, removeAuthToken } from './token.utils';

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
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
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      removeAuthToken();
      Router.reload();
    }
    return Promise.reject(error);
  }
);

class HttpClient {
  static async get<T>(url: string, params?: unknown): Promise<T> {
    const response = await Axios.get<T>(url, { params });
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any): Promise<T> {
    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(url: string, data: unknown): Promise<T> {
    const response = await Axios.put<T>(url, data);
    return response.data;
  }

  static async delete<T>(url: string): Promise<T> {
    const response = await Axios.delete<T>(url);
    return response.data;
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