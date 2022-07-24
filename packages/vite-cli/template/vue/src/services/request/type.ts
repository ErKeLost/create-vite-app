import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface stockRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (res: T) => T
  responseInterceptorCatch?: (error: any) => any
}

export interface stockRequestConfig<T = AxiosResponse>
  extends AxiosRequestConfig {
  interceptors?: stockRequestInterceptors<T>
  showLoading?: boolean
}
