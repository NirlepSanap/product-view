// Authentication service for DummyJSON API integration

// Types for authentication
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

// Constants
const DUMMYJSON_AUTH_URL = 'https://dummyjson.com/auth/login';
const TOKEN_KEY = 'viewcraft_token';
const USER_KEY = 'viewcraft_user';

// Test credentials (working DummyJSON credentials)
export const TEST_CREDENTIALS: LoginCredentials = {
  username: 'emilys',
  password: 'emilyspass'
};

/**
 * Login function that authenticates with DummyJSON API
 * @param credentials - Username and password
 * @returns Promise with authentication response
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(DUMMYJSON_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Authentication failed: ${response.status}`);
    }

    const authData: AuthResponse = await response.json();
    
    // Store token and user data in localStorage
    localStorage.setItem(TOKEN_KEY, authData.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: authData.id,
      username: authData.username,
      email: authData.email,
      firstName: authData.firstName,
      lastName: authData.lastName,
      gender: authData.gender,
      image: authData.image,
    }));

    return authData;
  } catch (error) {
    // Re-throw with a more user-friendly message
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Login failed. Please check your credentials and try again.');
  }
}

/**
 * Logout function that clears authentication data
 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Get the stored JWT token
 * @returns The token string or null if not found
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get the stored user data
 * @returns User object or null if not found
 */
export function getUser(): User | null {
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
}

/**
 * Check if user is currently authenticated
 * @returns Boolean indicating authentication status
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
}

/**
 * Validate token format (basic JWT structure check)
 * @param token - JWT token to validate
 * @returns Boolean indicating if token has valid JWT format
 */
export function isValidTokenFormat(token: string): boolean {
  if (!token) return false;
  
  // Basic JWT format check: should have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
}

/**
 * Check if the stored token is valid
 * @returns Boolean indicating if stored token is valid
 */
export function hasValidToken(): boolean {
  const token = getToken();
  if (!token) return false;
  
  return isValidTokenFormat(token);
}

/**
 * Get authentication headers for API requests
 * @returns Headers object with authorization token
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Clear invalid authentication data (cleanup utility)
 */
export function clearInvalidAuth(): void {
  const token = getToken();
  const user = getUser();
  
  // Clear if token is invalid format or user data is missing
  if ((token && !isValidTokenFormat(token)) || (!token && user) || (token && !user)) {
    logout();
  }
}

/**
 * Initialize auth service (call this on app startup)
 */
export function initAuthService(): void {
  // Clean up any invalid authentication data on startup
  clearInvalidAuth();
}

// Export for testing purposes
export const authService = {
  login,
  logout,
  getToken,
  getUser,
  isAuthenticated,
  hasValidToken,
  getAuthHeaders,
  initAuthService,
  TEST_CREDENTIALS,
};

export default authService;