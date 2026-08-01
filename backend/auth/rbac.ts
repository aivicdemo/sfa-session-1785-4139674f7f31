import { APIGatewayProxyEvent } from 'aws-lambda';

export type Role = 'admin' | 'operator' | 'viewer';

export interface RBACContext {
  userId: string;
  role: Role;
  email: string;
}

export const ROLE_PERMISSIONS: Record<Role, Set<string>> = {
  admin: new Set([
    'read:all',
    'write:all',
    'delete:all',
    'bulk:import',
    'audit:read',
  ]),
  operator: new Set([
    'read:all',
    'write:all',
    'bulk:import',
    'audit:read',
  ]),
  viewer: new Set([
    'read:all',
    'audit:read',
  ]),
};

export function extractRBACContext(event: APIGatewayProxyEvent): RBACContext | null {
  const authHeader = event.headers['Authorization'] || event.headers['authorization'];
  if (!authHeader) {
    return null;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return {
      userId: decoded.userId || '',
      role: (decoded.role || 'viewer') as Role,
      email: decoded.email || '',
    };
  } catch {
    return null;
  }
}

export function hasPermission(role: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.has(permission);
}

export function requirePermission(role: Role, permission: string): boolean {
  if (!hasPermission(role, permission)) {
    return false;
  }
  return true;
}