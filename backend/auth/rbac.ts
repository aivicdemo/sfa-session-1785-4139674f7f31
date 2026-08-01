import { APIGatewayProxyEvent } from 'aws-lambda';

export type Role = 'admin' | 'operator' | 'viewer';

export interface RBACContext {
  role: Role;
  userId: string;
  timestamp: string;
}

export function extractRBACContext(event: APIGatewayProxyEvent): RBACContext {
  const authHeader = event.headers['Authorization'] || '';
  const role = (event.headers['X-Role'] || 'viewer') as Role;
  const userId = event.headers['X-User-Id'] || 'anonymous';
  const timestamp = new Date().toISOString();

  if (!['admin', 'operator', 'viewer'].includes(role)) {
    throw new Error('Invalid role');
  }

  return { role, userId, timestamp };
}

export function checkPermission(role: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(role);
}

export function requireRoles(requiredRoles: Role[]) {
  return (role: Role): boolean => checkPermission(role, requiredRoles);
}

export const permissions = {
  readResources: requireRoles(['admin', 'operator', 'viewer']),
  createResource: requireRoles(['admin', 'operator']),
  updateResource: requireRoles(['admin', 'operator']),
  deleteResource: requireRoles(['admin']),
  bulkImport: requireRoles(['admin', 'operator']),
};