import { APIGatewayProxyEvent } from 'aws-lambda';

export type Role = 'admin' | 'operator' | 'viewer';

export interface AuthContext {
  userId: string;
  role: Role;
  loginId: string;
}

export const ROLE_PERMISSIONS: Record<Role, Set<string>> = {
  admin: new Set([
    'GET_RESOURCES',
    'POST_RESOURCES',
    'PUT_RESOURCES',
    'DELETE_RESOURCES',
    'BULK_IMPORT',
    'VIEW_AUDIT_LOG',
  ]),
  operator: new Set([
    'GET_RESOURCES',
    'POST_RESOURCES',
    'PUT_RESOURCES',
    'BULK_IMPORT',
  ]),
  viewer: new Set([
    'GET_RESOURCES',
  ]),
};

export function extractAuthContext(event: APIGatewayProxyEvent): AuthContext {
  const authHeader = event.headers['Authorization'] || '';
  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Missing authorization token');
  }
  
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return {
      userId: decoded.userId,
      role: decoded.role as Role,
      loginId: decoded.loginId,
    };
  } catch (error) {
    throw new Error('Invalid authorization token');
  }
}

export function hasPermission(role: Role, action: string): boolean {
  return ROLE_PERMISSIONS[role]?.has(action) ?? false;
}

export function requirePermission(role: Role, action: string): void {
  if (!hasPermission(role, action)) {
    throw new Error(`Forbidden: ${action}`);
  }
}