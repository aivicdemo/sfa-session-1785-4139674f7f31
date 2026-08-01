import { APIGatewayProxyEvent } from 'aws-lambda';

export type Role = 'admin' | 'operator' | 'viewer';

export interface AuthContext {
  userId: string;
  role: Role;
  loginId: string;
  email: string;
  userName: string;
}

export const ROLE_PERMISSIONS: Record<Role, Set<string>> = {
  admin: new Set([
    'GET:/resources',
    'POST:/api/0/bulk',
    'POST:/api/1/bulk',
    'POST:/api/2/bulk',
    'POST:/api/3/bulk',
    'POST:/api/4/bulk',
    'POST:/api/5/bulk',
    'POST:/api/6/bulk',
    'POST:/api/7/bulk',
    'POST:/api/8/bulk',
    'POST:/api/9/bulk',
    'POST:/api/10/bulk',
    'POST:/api/11/bulk',
    'POST:/api/12/bulk',
    'POST:/api/13/bulk',
    'POST:/api/14/bulk',
    'POST:/api/15/bulk',
  ]),
  operator: new Set([
    'GET:/resources',
    'POST:/api/0/bulk',
    'POST:/api/1/bulk',
    'POST:/api/2/bulk',
    'POST:/api/3/bulk',
    'POST:/api/4/bulk',
    'POST:/api/5/bulk',
    'POST:/api/6/bulk',
    'POST:/api/7/bulk',
    'POST:/api/8/bulk',
    'POST:/api/9/bulk',
    'POST:/api/10/bulk',
    'POST:/api/11/bulk',
    'POST:/api/12/bulk',
    'POST:/api/13/bulk',
    'POST:/api/14/bulk',
    'POST:/api/15/bulk',
  ]),
  viewer: new Set([
    'GET:/resources',
  ]),
};

export function extractAuthContext(event: APIGatewayProxyEvent): AuthContext | null {
  const authHeader = event.headers['Authorization'] || event.headers['authorization'];
  if (!authHeader) return null;

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return {
      userId: decoded.userId || '',
      role: (decoded.role || 'viewer') as Role,
      loginId: decoded.loginId || '',
      email: decoded.email || '',
      userName: decoded.userName || '',
    };
  } catch {
    return null;
  }
}

export function checkPermission(auth: AuthContext | null, method: string, path: string): boolean {
  if (!auth) return false;
  const permission = `${method}:${path}`;
  return ROLE_PERMISSIONS[auth.role]?.has(permission) ?? false;
}