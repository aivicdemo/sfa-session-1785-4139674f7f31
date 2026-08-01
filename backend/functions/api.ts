import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { extractRBACContext, checkPermission, permissions } from './rbac';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-northeast-1' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.MAIN_TABLE || 'resources';

interface Resource {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface AuditLog {
  pk: string;
  sk: string;
  action: string;
  userId: string;
  timestamp: string;
  details: Record<string, unknown>;
}

function createErrorResponse(statusCode: number, message: string): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
    headers: { 'Content-Type': 'application/json' },
  };
}

function createSuccessResponse(statusCode: number, data: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };
}

async function writeAuditLog(
  action: string,
  userId: string,
  details: Record<string, unknown>
): Promise<void> {
  const auditLog: AuditLog = {
    pk: 'AUDIT',
    sk: `${action}#${Date.now()}#${randomUUID()}`,
    action,
    userId,
    timestamp: new Date().toISOString(),
    details,
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: auditLog,
    })
  );
}

async function getResources(): Promise<APIGatewayProxyResult> {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'attribute_not_exists(pk) OR pk <> :auditPk',
        ExpressionAttributeValues: {
          ':auditPk': 'AUDIT',
        },
      })
    );

    return createSuccessResponse(200, {
      items: result.Items || [],
      count: result.Count || 0,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return createErrorResponse(500, 'Failed to fetch resources');
  }
}

async function getResourceById(id: string): Promise<APIGatewayProxyResult> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    if (!result.Item) {
      return createErrorResponse(404, 'Resource not found');
    }

    return createSuccessResponse(200, result.Item);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return createErrorResponse(500, 'Failed to fetch resource');
  }
}

async function createResource(
  body: Record<string, unknown>,
  userId: string
): Promise<APIGatewayProxyResult> {
  try {
    if (!body.name || typeof body.name !== 'string') {
      return createErrorResponse(400, 'Invalid request: name is required');
    }

    const now = new Date().toISOString();
    const resource: Resource = {
      id: randomUUID(),
      name: body.name,
      description: body.description as string | undefined,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: resource,
      })
    );

    await writeAuditLog('CREATE', userId, { resourceId: resource.id, name: resource.name });

    return createSuccessResponse(201, resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    return createErrorResponse(500, 'Failed to create resource');
  }
}

async function updateResource(
  id: string,
  body: Record<string, unknown>,
  userId: string
): Promise<APIGatewayProxyResult> {
  try {
    const getResult = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    if (!getResult.Item) {
      return createErrorResponse(404, 'Resource not found');
    }

    const updateData: Record<string, unknown> = {};
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};
    const updateExpressions: string[] = [];

    if (body.name && typeof body.name === 'string') {
      updateData.name = body.name;
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = body.name;
      updateExpressions.push('#name = :name');
    }

    if (body.description !== undefined) {
      updateData.description = body.description;
      expressionAttributeNames['#desc'] = 'description';
      expressionAttributeValues[':desc'] = body.description;
      updateExpressions.push('#desc = :desc');
    }

    expressionAttributeNames['#updated'] = 'updatedAt';
    expressionAttributeValues[':updated'] = new Date().toISOString();
    updateExpressions.push('#updated = :updated');

    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    await writeAuditLog('UPDATE', userId, { resourceId: id, updates: updateData });

    const updatedResult = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    return createSuccessResponse(200, updatedResult.Item);
  } catch (error) {
    console.error('Error updating resource:', error);
    return createErrorResponse(500, 'Failed to update resource');
  }
}

async function deleteResource(id: string, userId: string): Promise<APIGatewayProxyResult> {
  try {
    const getResult = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    if (!getResult.Item) {
      return createErrorResponse(404, 'Resource not found');
    }

    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    await writeAuditLog('DELETE', userId, { resourceId: id });

    return createSuccessResponse(200, { message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return createErrorResponse(500, 'Failed to delete resource');
  }
}

async function bulkImport(
  items: Record<string, unknown>[],
  userId: string
): Promise<APIGatewayProxyResult> {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      return createErrorResponse(400, 'Invalid request: items array is required and must not be empty');
    }

    const now = new Date().toISOString();
    const processedItems: Resource[] = [];
    const errors: string[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.name || typeof item.name !== 'string') {
        errors.push(`Item ${i}: name is required`);
        continue;
      }

      const resource: Resource = {
        id: randomUUID(),
        name: item.name,
        description: item.description as string | undefined,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
      };
      processedItems.push(resource);
    }

    let imported = 0;
    let failed = errors.length;

    for (let i = 0; i < processedItems.length; i += 25) {
      const batch = processedItems.slice(i, i + 25);
      const requestItems = batch.map((item) => ({
        PutRequest: {
          Item: item,
        },
      }));

      try {
        await docClient.send(
          new BatchWriteCommand({
            RequestItems: {
              [TABLE_NAME]: requestItems,
            },
          })
        );
        imported += batch.length;
      } catch (batchError) {
        console.error('Batch write error:', batchError);
        failed += batch.length;
        errors.push(`Batch ${Math.floor(i / 25)}: ${String(batchError)}`);
      }
    }

    await writeAuditLog('BULK_IMPORT', userId, {
      imported,
      failed,
      totalRequested: items.length,
    });

    return createSuccessResponse(200, {
      imported,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error in bulk import:', error);
    return createErrorResponse(500, 'Failed to process bulk import');
  }
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const rbacContext = extractRBACContext(event);
    const method = event.httpMethod;
    const path = event.path;
    const body = event.body ? JSON.parse(event.body) : {};

    if (method === 'GET' && path === '/resources') {
      if (!permissions.readResources(rbacContext.role)) {
        return createErrorResponse(403, 'Forbidden: insufficient permissions');
      }
      return await getResources();
    }

    if (method === 'GET' && path.match(/^\/resources\/[^/]+$/)) {
      if (!permissions.readResources(rbacContext.role)) {
        return createErrorResponse(403, 'Forbidden: insufficient permissions');
      }
      const id = path.split('/')[2];
      return await getResourceById(id);
    }

    if (method === 'POST' && path === '/resources') {
      if (!permissions.createResource(rbacContext.role)) {
        return createErrorResponse(403, 'Forbidden: insufficient permissions');
      }
      return await createResource(body, rbacContext.userId);
    }

    if (method === 'PUT' && path.match(/^\/resources\/[^/]+$/)) {
      if (!permissions.updateResource(rbacContext.role)) {
        return createErrorResponse(403, 'Forbidden: insufficient permissions');
      }
      const id = path.split('/')[2];
      return await updateResource(id, body, rbacContext.userId);
    }

    if (method === 'DELETE' && path.match(/^\/resources\/[^/]+$/)) {
      if (!permissions.deleteResource(rbacContext.role)) {
        return createErrorResponse(403, 'Forbidden: insufficient permissions');
      }
      const id = path.split('/')[2];
      return await deleteResource(id, rbacContext.userId);
    }

    if (method === 'POST' && path === '/resources/bulk') {
      if (!permissions.bulkImport(rbacContext.role)) {
        return createErrorResponse(403, 'Forbidden: insufficient permissions');
      }
      return await bulkImport(body.items || [], rbacContext.userId);
    }

    return createErrorResponse(404, 'Not found');
  } catch (error) {
    console.error('Unhandled error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
}