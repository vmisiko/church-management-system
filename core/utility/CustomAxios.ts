/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    AxiosInstance,
    InternalAxiosRequestConfig as AxiosInternalRequestConfig,
    AxiosRequestConfig,
    AxiosResponse,
  } from "axios";
  import axios from "axios";
  
  import type {
    AuthenticationError,
    AuthorizationError,
    DataError,
    NetworkError,
    TimeoutError,
  } from "../domain/DataError";
  import type { Either } from "../domain/Either";
  import { NetworkConstants } from "./NetworkConstants";
  
  let isRedirectingToSignin = false;
  
  /** Resolved lazily so CustomAxios does not need tokens at construction time. */
  export interface IAuthTokenSource {
    getAccessToken(): string | null;
    getElevatedToken(): string | null;
    logout(): Promise<unknown>;
    refreshSession(): Promise<Either<string, any>>;

  }
  
  export type GetAuthPloc = () => IAuthTokenSource | null;
  
  export interface InternalAxiosRequestConfig<D = any>
    extends AxiosRequestConfig<D> {
    showToast?: boolean;
    __retryCount?: number;
    _retry?: boolean;
    skipAuth?: boolean;
  }
  
  export class CustomAxios {
    private axiosInstance: AxiosInstance;
  
    private readonly maxRetries = 2;
    private readonly retryDelay = 1000;
  
    /** Deduplicates concurrent 401s so only one refresh runs at a time. */
    private refreshInFlight: Promise<boolean> | null = null;
  
    private readonly getAuthPloc: GetAuthPloc;
    private readonly router?: (to: string) => void | Promise<void>;
  
    constructor({
      getAuthPloc,
      router,
      baseURL,
      timeout,
    }: {
      getAuthPloc: GetAuthPloc;
      router?: (to: string) => void | Promise<void>;
      baseURL?: string;
      timeout?: number;
    }) {
      this.getAuthPloc = getAuthPloc;
      this.router = router;
  
      this.axiosInstance = axios.create({
        baseURL: baseURL ?? NetworkConstants.BASE_URL,
        timeout: timeout ?? 10000,
      });
  
      this.setupInterceptors();
    }
  
    get<T>(url: string, config: InternalAxiosRequestConfig = {}): Promise<T>     {
      return this.axiosInstance.get(url, { ...config });
    }
  
    post<T>(url: string, data?: any, config: InternalAxiosRequestConfig = {}): Promise<T> {
      return this.axiosInstance.post(url, data, { ...config });
    }
  
    put<T>(url: string, data?: any, config: InternalAxiosRequestConfig = {}): Promise<T> {
      return this.axiosInstance.put(url, data, { ...config });
    }
  
    patch<T>(url: string, data?: any, config: InternalAxiosRequestConfig = {}): Promise<T> {
      return this.axiosInstance.patch(url, data, { ...config });
    }
  
    delete<T>(url: string, config: InternalAxiosRequestConfig = {}): Promise<T> {
      return this.axiosInstance.delete(url, { ...config });
    }
  
    /** @deprecated Tokens come from AuthPloc via getAuthPloc; kept for gradual migration. */
    setToken(_token?: string): void {}
  
    private redirectToSignin(): void {
      if (this.router && !isRedirectingToSignin) {
        isRedirectingToSignin = true;
        Promise.resolve(this.router("/login")).finally(() => {
          isRedirectingToSignin = false;
        });
      }
    }
  
    private isRefreshTokenRequest(config: { url?: string }): boolean {
      const path = String(config.url ?? "");
      return path.includes("/auth/refresh");
    }
  
    private normalizeRequestPath(url?: string): string {
      if (!url) return "";
      try {
        return new URL(url, "http://local").pathname;
      } catch {
        const withoutQuery = url.split("?")[0] ?? "";
        return withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
      }
    }
  
    /** Reference lookups use POST but are idempotent reads — safe to retry on network/timeout. */
    private isReferenceDataPost(config: InternalAxiosRequestConfig): boolean {
      const method = String(config.method ?? "get").toUpperCase();
      if (method !== "POST") return false;
      const path = this.normalizeRequestPath(config.url);
      return path === "/reference" || path.startsWith("/reference/");
    }
  
    /** Avoid duplicate side effects: only GET (and reference POST) retry on timeout/network. */
    private isNetworkRetryAllowed(config: InternalAxiosRequestConfig): boolean {
      const method = String(config.method ?? "get").toUpperCase();
      if (method === "POST") return this.isReferenceDataPost(config);
      if (method === "PUT") return false;
      return true;
    }
  
    private refreshSessionSingleFlight(
      authPloc: IAuthTokenSource
    ): Promise<boolean> {
      if (this.refreshInFlight) {
        return this.refreshInFlight;
      }
      const p = authPloc
        .refreshSession()
        .then((result) => result.isRight())
        .finally(() => {
          if (this.refreshInFlight === p) {
            this.refreshInFlight = null;
          }
        });
      this.refreshInFlight = p;
      return p;
    }
  
    private setupInterceptors() {
      this.axiosInstance.interceptors.request.use(
        (
          config: AxiosInternalRequestConfig & InternalAxiosRequestConfig
        ): AxiosInternalRequestConfig & InternalAxiosRequestConfig => {
          const isFormData = config.data instanceof FormData;
  
          if (!isFormData) {
            config.headers["Content-Type"] = "application/json";
          }
          config.headers["Accept"] = "application/json";
          // config.withCredentials = true;
  
          if (config.skipAuth) {
            return config;
          }
  
          const authPloc = this.getAuthPloc();
          const access = authPloc?.getAccessToken();
          if (typeof access === "string" && access.length > 0) {
            config.headers = config.headers ?? {};
            // Always set (overwrite) so 401 retries pick up tokens from refresh — if we only
            // set when Authorization was missing, the retried request would keep the stale bearer.
            const h = config.headers as unknown as {
              set?: (key: string, value: string) => void;
            };
            if (typeof h.set === "function") {
              h.set("Authorization", `Bearer ${access}`);
            } else {
              (config.headers as Record<string, string>)["Authorization"] =
                `Bearer ${access}`;
            }
          }
  
          return config;
        },
        error => Promise.reject(error)
      );
  
      this.axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
          const method = response.config?.method
            ? String(response.config.method).toUpperCase()
            : "";
          const showToast =
            (response.config as InternalAxiosRequestConfig)?.showToast ?? false;
  
          if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && showToast) {
                // notifySuccess(response);
          }
  
          return response;
        },
        async (error): Promise<DataError> => {
          const config = error.config as InternalAxiosRequestConfig | undefined;
  
          const baseErrorInfo = {
            timestamp: new Date(),
            source: "HttpClient",
            originalError: error,
          };
  
          if (config?.showToast) {
                // notifyError(error);
          }
  
          if (!config) {
            return Promise.reject(
              Object.assign(new Error("Request configuration missing"), {
                kind: "NetworkError" as const,
              })
            );
          }
  
          config.__retryCount = config.__retryCount || 0;
  
          if (
            error.code === "ECONNABORTED" ||
            (!error.response && error.request)
          ) {
            if (!this.isNetworkRetryAllowed(config)) {
              return Promise.reject<NetworkError>({
                ...baseErrorInfo,
                kind: "NetworkError",
                message:
                  error.code === "ECONNABORTED"
                    ? "Request timed out"
                    : "Network error — request not retried for mutating operations",
                code: error.code,
              });
            }
  
            if (config.__retryCount < this.maxRetries) {
              config.__retryCount += 1;
              await new Promise(resolve =>
                setTimeout(resolve, this.retryDelay)
              );
              return this.axiosInstance.request(config);
            }
  
            return Promise.reject<TimeoutError>({
              ...baseErrorInfo,
              kind: "TimeoutError",
              message: "Request timed out after multiple retries",
              duration: this.axiosInstance.defaults.timeout ?? 5000,
            });
          }
  
          if (error.response) {
            const statusCode = error.response.status;
  
            switch (statusCode) {
              case 401: {
                if (config.skipAuth) {
                  if (this.isRefreshTokenRequest(config)) {
                    void this.getAuthPloc()?.logout().catch(() => {});
                    this.redirectToSignin();
                  }
                  return Promise.reject(error);
                }
  
                if (config._retry) {
                  void this.getAuthPloc()?.logout().catch(() => {});
                  this.redirectToSignin();
                  return Promise.reject<AuthenticationError>({
                    ...baseErrorInfo,
                    kind: "AuthenticationError",
                    message:
                      error.response.data?.detail ||
                      error.response.data?.message ||
                      "Authentication failed",
                    operation: "request",
                  });
                }
  
                const authPloc = this.getAuthPloc();
                if (!authPloc) {
                  this.redirectToSignin();
                  return Promise.reject<AuthenticationError>({
                    ...baseErrorInfo,
                    kind: "AuthenticationError",
                    message:
                      error.response.data?.detail ||
                      error.response.data?.message ||
                      "Authentication failed",
                    operation: "request",
                  });
                }
  
                const refreshed = await this.refreshSessionSingleFlight(authPloc);
                if (!refreshed) {
                  void authPloc.logout().catch(() => {});
                  this.redirectToSignin();
                  return Promise.reject<AuthenticationError>({
                    ...baseErrorInfo,
                    kind: "AuthenticationError",
                    message:
                      error.response.data?.detail ||
                      error.response.data?.message ||
                      "Authentication failed",
                    operation: "request",
                  });
                }
  
                config._retry = true;
                return this.axiosInstance.request(config);
              }
  
              case 403:
                return Promise.reject<AuthorizationError>({
                  ...baseErrorInfo,
                  kind: "AuthorizationError",
                  message:
                    error.response.data?.detail ||
                    error.response.data?.message ||
                    "Not authorized to perform this operation",
                  operation: "request",
                  requiredPermissions:
                    error.response.headers["x-required-permissions"]?.split(
                      ","
                    ) || [],
                });
  
              default: {
                let errorMessage = "Unexpected error occurred";
                let errorCode: string | undefined;
  
                if (error.response.data instanceof Blob) {
                  try {
                    const text = await error.response.data.text();
                    const parsedData = JSON.parse(text) as {
                      message?: string;
                      detail?: string;
                      code?: string;
                    };
                    errorMessage =
                      parsedData.message ||
                      parsedData.detail ||
                      errorMessage;
                    errorCode = parsedData.code;
                  } catch {
                    errorMessage = "Server error — unable to parse response";
                  }
                } else if (
                  error.response.data &&
                  typeof error.response.data === "object"
                ) {
                  const d = error.response.data as {
                    message?: string;
                    detail?: string;
                    code?: string;
                  };
                  errorMessage = d.message || d.detail || errorMessage;
                  errorCode = d.code;
                }
  
                return Promise.reject<NetworkError>({
                  ...baseErrorInfo,
                  kind: "NetworkError",
                  message: errorMessage,
                  statusCode,
                  code: errorCode,
                });
              }
            }
          }
  
          return Promise.reject<NetworkError>({
            ...baseErrorInfo,
            kind: "NetworkError",
            message:
              error.response?.data?.detail ||
              error.response?.data?.message ||
              "Failed to setup the request",
            code: error.code,
          });
        }
      );
    }
  }
  
  export default CustomAxios;
  