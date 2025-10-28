export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest extends LoginRequest {
  fullname?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
}