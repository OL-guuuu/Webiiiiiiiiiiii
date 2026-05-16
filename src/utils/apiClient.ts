/**
 * API Client for Site Configuration
 * Handles communication with the backend API
 */

import { type SiteConfig } from '../config/siteConfig';
import { API_BASE_URL, DASHBOARD_PASSWORD } from '../config/runtimeConfig';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  lastUpdated?: number;
  version?: string;
  authenticated?: boolean;
  source?: string;
  warning?: string;
  message?: string;
  availableStorages?: {
    vercel_kv: boolean;
    upstash_redis: boolean;
    file: boolean;
  };
  timestamp?: number;
}

export interface AuthResponse {
  success: boolean;
  authenticated: boolean;
  error?: string;
}

export interface HealthCheckResponse {
  success: boolean;
  status: 'healthy' | 'degraded' | 'critical' | 'error';
  storage?: {
    vercelKv?: { configured: boolean; status: string };
    upstashRedis?: { configured: boolean; status: string };
    localFile?: { configured: boolean; status: string };
  };
  recommendations?: string[];
  timestamp?: string;
}

const DEFAULT_TIMEOUT_MS = 12000;

const createTimeoutSignal = (timeoutMs = DEFAULT_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
};

const safeParseJson = (text: string) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

/**
 * Check API health and storage backend status
 */
export async function checkApiHealth(): Promise<HealthCheckResponse> {
  try {
    const { signal, clear } = createTimeoutSignal();
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal,
    });
    const raw = await response.text();
    clear();
    const data = safeParseJson(raw);

    if (!response.ok) {
      console.error('[API Health] HTTP error:', response.status);
      return {
        success: false,
        status: 'error',
        recommendations: ['API endpoint is not responding. Check your connection.'],
      };
    }

    if (!data) {
      return {
        success: false,
        status: 'error',
        recommendations: ['API health response is not valid JSON.'],
      };
    }

    return data as HealthCheckResponse;
  } catch (error) {
    console.error('[API Health] Error checking health:', error);
    return {
      success: false,
      status: 'error',
      recommendations: [
        `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'Make sure your site is deployed and the API endpoint is accessible.',
      ],
    };
  }
}

/**
 * Fetch site configuration from API
 */
export async function fetchSiteConfig(): Promise<ApiResponse<SiteConfig>> {
  try {
    const { signal, clear } = createTimeoutSignal();
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store', // Always fetch fresh data
      signal,
    });
    const raw = await response.text();
    clear();

    const data = safeParseJson(raw);
    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `HTTP error! status: ${response.status}`,
      };
    }

    if (!data) {
      return {
        success: false,
        error: 'API returned non-JSON response for config fetch.',
      };
    }

    console.log('[API Fetch] Config loaded from:', data.source);
    return data as ApiResponse<SiteConfig>;
  } catch (error) {
    console.error('[API Fetch] Error fetching site config:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch configuration',
    };
  }
}

/**
 * Update site configuration via API
 */
export async function updateSiteConfig(config: SiteConfig): Promise<ApiResponse<SiteConfig>> {
  try {
    console.log('[API Update] Starting config update...');

    const { signal, clear } = createTimeoutSignal();
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(config),
      signal,
    });
    const raw = await response.text();
    clear();
    const data = safeParseJson(raw) || {};

    if (!response.ok) {
      console.error('[API Update] Update failed:', data);

      if (response.status === 401) {
        return {
          success: false,
          error: 'API request blocked (401). Your domain may be protected by Vercel authentication. Use the production domain or disable protection.',
        };
      }
      
      // Provide helpful error messages based on response
      if (response.status === 503) {
        return {
          success: false,
          error: 'Storage backend is not configured. Please add Vercel KV or Upstash Redis environment variables.',
          message: 'To set up persistent storage, follow the QUICK_UPSTASH_SETUP.md guide in your project.',
        };
      }

      if (response.status === 400) {
        return {
          success: false,
          error: 'Invalid request format. The configuration data may be corrupted.',
        };
      }

      return {
        success: false,
        error: data?.error || `HTTP error! status: ${response.status}`,
      };
    }

    if (!data || typeof data !== 'object') {
      return {
        success: false,
        error: 'API returned non-JSON response for config update.',
      };
    }

    console.log('[API Update] Config saved successfully to:', data.source);
    return data as ApiResponse<SiteConfig>;
  } catch (error) {
    console.error('[API Update] Error updating config:', error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Network error: Cannot reach the API endpoint. Check your connection and that the site is deployed.',
      };
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        error: 'API request timed out. The server did not respond in time.',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update configuration',
    };
  }
}

/**
 * Get detailed API diagnostics for troubleshooting
 */
export async function getApiDiagnostics(): Promise<{
  configEndpoint: boolean;
  healthEndpoint: HealthCheckResponse | null;
  errorMessages: string[];
}> {
  const errors: string[] = [];
  let healthStatus: HealthCheckResponse | null = null;

  // Check config endpoint
  let configOk = false;
  try {
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    configOk = response.ok;
    if (!configOk) errors.push(`Config endpoint returned status ${response.status}`);
  } catch (error) {
    errors.push(`Config endpoint error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  // Check health endpoint
  try {
    healthStatus = await checkApiHealth();
    if (healthStatus.recommendations && healthStatus.recommendations.length > 0) {
      errors.push(...healthStatus.recommendations);
    }
  } catch (error) {
    errors.push(`Health check failed: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  return {
    configEndpoint: configOk,
    healthEndpoint: healthStatus,
    errorMessages: errors,
  };
}

export async function checkDashboardAuth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) return false;

    const data = (await response.json()) as AuthResponse;
    return Boolean(data.authenticated);
  } catch {
    return false;
  }
}

export async function loginToDashboard(password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });

    const data = (await response.json()) as AuthResponse;
    if (!response.ok) {
      return { success: false, authenticated: false, error: data.error || 'Authentication failed' };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      authenticated: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
}

export async function logoutFromDashboard(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = (await response.json()) as AuthResponse;
    if (!response.ok) {
      return { success: false, authenticated: false, error: data.error || 'Logout failed' };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      authenticated: false,
      error: error instanceof Error ? error.message : 'Logout failed',
    };
  }
}

/**
 * Check storage availability
 */
export async function checkStorageStatus(): Promise<{
  vercel_kv: boolean;
  upstash_redis: boolean;
  file: boolean;
  environment: 'production' | 'development';
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/config/status`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        vercel_kv: false,
        upstash_redis: false,
        file: false,
        environment: 'production',
      };
    }

    const data = await response.json();
    return {
      vercel_kv: data.storage?.vercel_kv?.available ?? false,
      upstash_redis: data.storage?.upstash_redis?.available ?? false,
      file: data.storage?.file?.available ?? false,
      environment: data.environment ?? 'production',
    };
  } catch (error) {
    console.error('Error checking storage status:', error);
    return {
      vercel_kv: false,
      upstash_redis: false,
      file: false,
      environment: 'production',
    };
  }
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: number;
  ip?: string;
  userAgent?: string;
  read: boolean;
}

export interface MessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MessagesResponse {
  success: boolean;
  data?: Message[];
  error?: string;
  source?: string;
  timestamp?: number;
  count?: number;
}

export interface SendMessageResponse {
  success: boolean;
  message?: string;
  messageId?: string;
  error?: string;
  source?: string;
  timestamp?: number;
  rateLimitRemaining?: number;
}

/**
 * Send a contact message
 */
export async function sendMessage(messageData: MessageData): Promise<SendMessageResponse> {
  try {
    console.log('[API Messages] Sending message...');
    
    const { signal, clear } = createTimeoutSignal();
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
      signal,
    });
    const raw = await response.text();
    clear();

    const data = safeParseJson(raw);
    
    if (!response.ok) {
      console.error('[API Messages] Send failed:', data);
      return {
        success: false,
        error: data?.error || `HTTP error! status: ${response.status}`,
      };
    }

    if (!data) {
      return {
        success: false,
        error: 'API returned non-JSON response for message send.',
      };
    }

    console.log('[API Messages] Message sent successfully');
    return data as SendMessageResponse;
  } catch (error) {
    console.error('[API Messages] Error sending message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
}

/**
 * Fetch all messages
 */
export async function fetchMessages(): Promise<MessagesResponse> {
  try {
    console.log('[API Messages] Fetching messages...');
    
    const { signal, clear } = createTimeoutSignal();
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal,
    });
    const raw = await response.text();
    clear();

    const data = safeParseJson(raw);
    
    if (!response.ok) {
      console.error('[API Messages] Fetch failed:', data);
      return {
        success: false,
        error: data?.error || `HTTP error! status: ${response.status}`,
      };
    }

    if (!data) {
      return {
        success: false,
        error: 'API returned non-JSON response for messages fetch.',
      };
    }

    console.log(`[API Messages] Fetched ${data.count || 0} messages from ${data.source}`);
    return data as MessagesResponse;
  } catch (error) {
    console.error('[API Messages] Error fetching messages:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch messages',
    };
  }
}
