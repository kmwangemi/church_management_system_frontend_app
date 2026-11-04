export interface FastAPIValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface APIErrorResponse {
  detail?: FastAPIValidationError[] | string;
  message?: string;
  error?: string;
}

export interface APIError {
  response?: {
    data?: APIErrorResponse;
    status?: number;
    statusText?: string;
  };
  message?: string;
  name?: string;
}

export interface ContextLogger {
  error: (
    message: string,
    error?: Error | unknown,
    additionalMetadata?: Record<string, unknown>
  ) => Promise<void>;
  warn: (
    message: string,
    additionalMetadata?: Record<string, unknown>
  ) => Promise<void>;
  info: (
    message: string,
    additionalMetadata?: Record<string, unknown>
  ) => Promise<void>;
  debug: (
    message: string,
    additionalMetadata?: Record<string, unknown>
  ) => Promise<void>;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    url: string;
    secure_url: string;
    public_id: string;
    resource_type: string;
    format: string;
    bytes: number;
    width?: number;
    height?: number;
    created_at: string;
  };
}

export type FileType = 'image' | 'document' | 'logo';

export interface ChurchMembership {
  memberId: string;
  churchId: string;
  churchName: string;
  branchId: string;
  branchName: string;
  memberType: string;
  roles: string[];
}

export interface AuthUser {
  id?: string;
  sub: string;
  memberId?: string;
  churchId: string;
  branchId: string;
  churchName?: string;
  branchName?: string;
  role: string;
  roles?: string[];
  platformRole?: string;
  globalRole?: string;
  accessLevel?: string | null;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  memberships?: ChurchMembership[];
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isError: boolean;
  error?: APIError;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface ChurchRegistrationResponse {
  message: string;
  churchId: string;
  userId: string;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
