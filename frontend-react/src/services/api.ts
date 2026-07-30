export const BASE_URL = "https://localhost:7189/api/";

export interface RegisterPayload {
  name: string;
  age: number;
  email: string;
  password: string;
}

export interface RegisterUserResult {
  id: string;
  name: string;
  age: number;
  email: string;
}

export interface RegisterResponse {
  result: any;
  value: RegisterUserResult;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthSuccessValue {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    name: string;
    age: number;
    email: string;
  };
}

export interface LoginResponse {
  result: any;
  value: AuthSuccessValue;
}

export interface RefreshTokenPayload {
  AcessToken: string;
  accessToken?: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  result: any;
  value: AuthSuccessValue;
}

export interface UpdateUserPayload {
  name?: string;
  age?: number;
  email?: string;
  password?: string;
}

export interface UpdateUserResponse {
  result: any;
  value: AuthSuccessValue;
}

export interface RevokeResponse {
  message: string;
}

// Token storage keys
const ACCESS_TOKEN_KEY = "sl_access_token";
const REFRESH_TOKEN_KEY = "sl_refresh_token";
const AUTH_USER_KEY = "sl_auth_user";
const EXPIRES_AT_KEY = "sl_expires_at";

export function saveAuthData(
  accessToken: string,
  refreshToken: string,
  expiresAt: string,
  user: any,
) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (expiresAt) localStorage.setItem(EXPIRES_AT_KEY, expiresAt);
  if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAuthUser(): any | null {
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function clearAuthData() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function getExpiresAt(): string | null {
  return localStorage.getItem(EXPIRES_AT_KEY);
}

export function isTokenExpired(): boolean {
  const expiresAt = getExpiresAt();
  if (!expiresAt) return false;
  const expiresTime = new Date(expiresAt).getTime();
  if (isNaN(expiresTime)) return false;
  // Consider expired if current time >= expiresTime
  return Date.now() >= expiresTime;
}

export type AuthErrorCallback = () => void;
let onAuthErrorCallback: AuthErrorCallback | null = null;

export function setOnAuthErrorCallback(cb: AuthErrorCallback | null) {
  onAuthErrorCallback = cb;
}

export function handleAuthFailure() {
  clearAuthData();
  if (onAuthErrorCallback) {
    onAuthErrorCallback();
  }
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
}

/**
 * Validate Password
 * Must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
 * Length must be between 8 and 100 characters.
 */
export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
} {
  if (!password || password.length < 8 || password.length > 100) {
    return {
      valid: false,
      error: "A senha deve conter entre 8 e 100 caracteres.",
    };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
    return {
      valid: false,
      error:
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    };
  }

  return { valid: true };
}

export interface BackendErrorModel {
  StatusCode?: number;
  statusCode?: number;
  Error?: string;
  error?: string;
  Message?: string;
  message?: string;
  Timestamp?: string;
  timestamp?: string;
  TraceId?: string;
  traceId?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
}

export class ApiError extends Error {
  statusCode: number;
  errorType?: string;
  traceId?: string;

  constructor(message: string, statusCode: number, errorType?: string, traceId?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.traceId = traceId;
  }
}

/**
 * Parses API error response body supporting standard error models and alternative formats
 */
export async function parseApiError(res: Response): Promise<{
  message: string;
  statusCode: number;
  errorType?: string;
  traceId?: string;
}> {
  const statusCode = res.status;
  let rawText = '';

  try {
    rawText = await res.text();
  } catch {
    // Ignore text reading error
  }

  if (!rawText || !rawText.trim()) {
    return {
      statusCode,
      message: `Erro na requisição (${statusCode} ${res.statusText || 'Sem conteúdo'})`,
    };
  }

  // Attempt 1: Parse JSON model
  try {
    const json: BackendErrorModel = JSON.parse(rawText);
    if (typeof json === 'object' && json !== null) {
      const code = json.StatusCode || json.statusCode || statusCode;
      const errorType = json.Error || json.error;
      const message = json.Message || json.message;
      const traceId = json.TraceId || json.traceId;

      if (message) {
        return {
          statusCode: code,
          errorType,
          message,
          traceId,
        };
      }

      if (errorType) {
        return {
          statusCode: code,
          errorType,
          message: `${errorType} (Erro ${code})`,
          traceId,
        };
      }

      if (json.detail || json.title) {
        return {
          statusCode: code,
          message: json.detail || json.title || `Erro ${code}`,
          traceId,
        };
      }

      // Handle ASP.NET style validation errors dictionary
      if (json.errors && typeof json.errors === 'object') {
        const errorList: string[] = [];
        for (const [_, val] of Object.entries(json.errors)) {
          if (Array.isArray(val)) {
            errorList.push(...val);
          } else if (typeof val === 'string') {
            errorList.push(val);
          }
        }
        if (errorList.length > 0) {
          return {
            statusCode: code,
            message: errorList.join(' • '),
            traceId,
          };
        }
      }
    }
  } catch {
    // Non-JSON response
  }

  // Attempt 2: Clean plain text if non-HTML
  const cleanText = rawText.replace(/<[^>]*>?/gm, '').trim();
  if (cleanText && cleanText.length < 300) {
    return {
      statusCode,
      message: cleanText,
    };
  }

  return {
    statusCode,
    message: `Erro na requisição (${statusCode} ${res.statusText || 'Falha no servidor'})`,
  };
}

/**
 * Helper fetch function that automatically adds Authorization: Bearer <accessToken>
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<Response> {
  let token = getAccessToken();
  const cleanEndpoint = endpoint.replace(/^\//, "");
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${cleanEndpoint}`;

  const isAuthEndpoint =
    cleanEndpoint.includes('Auth/login') ||
    cleanEndpoint.includes('Auth/register') ||
    cleanEndpoint.includes('Auth/refresh-token');

  // Check if token is expired based on expiresAt BEFORE calling the API
  if (!isAuthEndpoint && isAuthenticated() && isTokenExpired()) {
    try {
      const currentRefreshToken = getRefreshToken();
      const refreshRes = await refreshTokenApi(token || "", currentRefreshToken || "");
      const val = refreshRes.value || (refreshRes as any);
      if (val?.accessToken) {
        token = val.accessToken;
      }
    } catch (err) {
      console.warn('Token proactive refresh failed due to expiration:', err);
      handleAuthFailure();
      throw new ApiError('Sessão expirada. Faça login novamente.', 401, 'Unauthorized');
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    // Auto refresh token if 401 and refresh token exists
    if (
      res.status === 401 &&
      !isRetry &&
      !isAuthEndpoint
    ) {
      const currentRefreshToken = getRefreshToken();
      if (currentRefreshToken) {
        try {
          const refreshRes = await refreshTokenApi(token || "", currentRefreshToken);
          const val = refreshRes.value || (refreshRes as any);
          if (val?.accessToken) {
            headers["Authorization"] = `Bearer ${val.accessToken}`;
            return await fetch(url, {
              ...options,
              headers,
            });
          } else {
            handleAuthFailure();
          }
        } catch (err) {
          console.warn('Refresh token failed on 401 response:', err);
          handleAuthFailure();
        }
      } else {
        handleAuthFailure();
      }
    }

    return res;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    console.error(`API Fetch Error on ${url}:`, err);
    throw new ApiError(
      `Falha de conexão com a API (${cleanEndpoint}). Certifique-se de que a API em ${BASE_URL} esteja em execução.`,
      0,
      'ConnectionError'
    );
  }
}

/**
 * POST /api/Auth/register
 */
export async function registerApi(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const url = `${BASE_URL}Auth/register`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const parsed = await parseApiError(res);
      throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
    }

    const data: RegisterResponse = await res.json();
    return data;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      `Falha de conexão com ${url}. Certifique-se de que a API esteja em execução.`,
      0,
      'ConnectionError'
    );
  }
}

/**
 * POST /api/Auth/login
 */
export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const url = `${BASE_URL}Auth/login`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const parsed = await parseApiError(res);
      throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
    }

    const data: LoginResponse = await res.json();
    
    // Save token data locally if returned
    const val = data.value || (data as any);
    if (val?.accessToken) {
      saveAuthData(val.accessToken, val.refreshToken, val.expiresAt, val.user);
    }

    return data;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      `Falha de conexão com ${url}. Certifique-se de que a API esteja em execução.`,
      0,
      'ConnectionError'
    );
  }
}

/**
 * POST /api/Auth/revoke/{userID}
 * Revokes refresh token (logout endpoint)
 */
export async function revokeApi(userId: string): Promise<RevokeResponse> {
  const res = await apiFetch(`Auth/revoke/${userId}`, {
    method: "POST",
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  const data = await res.json();
  clearAuthData();
  return data;
}

/**
 * POST /api/Auth/refresh-token
 * Sends AcessToken and refreshToken to renew access
 */
export async function refreshTokenApi(
  accessToken?: string,
  refreshToken?: string
): Promise<RefreshTokenResponse> {
  const accToken = accessToken || getAccessToken() || "";
  const refToken = refreshToken || getRefreshToken() || "";

  const payload: RefreshTokenPayload = {
    AcessToken: accToken,
    accessToken: accToken,
    refreshToken: refToken,
  };

  const res = await fetch(`${BASE_URL}Auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  const data: RefreshTokenResponse = await res.json();

  // Update local tokens with new refreshed value
  const val = data.value || (data as any);
  if (val?.accessToken) {
    saveAuthData(val.accessToken, val.refreshToken, val.expiresAt, val.user);
  }

  return data;
}

/**
 * POST /api/Auth/update-user
 * Updates user credentials / profile (requires Bearer token)
 */
export async function updateUserApi(
  payload: UpdateUserPayload
): Promise<UpdateUserResponse> {
  const res = await apiFetch("Auth/update-user", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  const data: UpdateUserResponse = await res.json();

  // Update local storage with newly issued tokens and user info
  const val = data.value || (data as any);
  if (val?.accessToken) {
    saveAuthData(val.accessToken, val.refreshToken, val.expiresAt, val.user);
  }

  return data;
}

