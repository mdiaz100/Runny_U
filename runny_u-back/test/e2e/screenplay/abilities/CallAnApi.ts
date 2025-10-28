import { Ability } from '@serenity-js/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class CallAnApi extends Ability {
  private axiosInstance: AxiosInstance;

  static at(baseURL: string): CallAnApi {
    return new CallAnApi(baseURL);
  }

  constructor(baseURL: string) {
    super();
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true, // No lanzar error en status != 2xx
    });
  }

  async post<T = any>(endpoint: string, data: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(endpoint, data);
  }

  async get<T = any>(endpoint: string): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(endpoint);
  }
}