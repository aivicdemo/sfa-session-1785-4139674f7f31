import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  DynamoDBClient,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { extractRBACContext, requirePermission, Role } from './rbac';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-northeast-1' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.MAIN_TABLE || 'SalesAuditSystem';

interface AuditLog {
  pk: string;
  sk: string;
  action: string;
  userId: string;
  timestamp: number;
  details: Record<string, unknown>;
}

interface Resource {
  id: string;
  name: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

const TABLE_INDICES = [
  'login_users',
  'sales_representatives',
  'customers',
  'sales_opportunities',
  'sales_activities',
  'sales_activity_logs',
  'contract_results',
  'behavior_pattern_analysis',
  'ai_inference_logs',
  'ai_inference_accuracy_monitoring',
  'alert_settings',
  'alert_history',
  'sales_process_definitions',
  'sales_process_execution_status',
  'report_generation_history',
  'dashboard_settings',
];

async function createAuditLog(
  action: string,
  userId: string,
  details: Record<string, unknown>
): Promise<void> {
  const auditLog: AuditLog = {
    pk: 'AUDIT',
    sk: `${Date.now()}#${uuidv4()}`,
    action,
    userId,
    timestamp: Date.now(),
    details,
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: auditLog,
      })
    );
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

function createErrorResponse(statusCode: number, message: string): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
    headers: { 'Content-Type': 'application/json' },
  };
}

function createSuccessResponse(
  statusCode: number,
  data: Record<string, unknown>
): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };
}

async function handleGetResources(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const context = extractRBACContext(event);
  if (!context) {
    return createErrorResponse(401, 'Unauthorized');
  }

  if (!requirePermission(context.role, 'read:all')) {
    return createErrorResponse(403, 'Forbidden');
  }

  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'attribute_exists(id)',
        Limit: 100,
      })
    );

    const resources: Resource[] = (result.Items || []).map((item: Record<string, unknown>) => ({
      id: item.id as string,
      name: item.name as string,
      type: item.type as string,
      createdAt: item.createdAt as number,
      updatedAt: item.updatedAt as number,
      createdBy: item.createdBy as string,
    }));

    await createAuditLog('GET_RESOURCES', context.userId, {
      count: resources.length,
    });

    return createSuccessResponse(200, {
      resources,
      count: resources.length,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return createErrorResponse(500, 'Internal Server Error');
  }
}

async function handleBulkImport(
  event: APIGatewayProxyEvent,
  tableIndex: string
): Promise<APIGatewayProxyResult> {
  const context = extractRBACContext(event);
  if (!context) {
    return createErrorResponse(401, 'Unauthorized');
  }

  if (!requirePermission(context.role, 'bulk:import')) {
    return createErrorResponse(403, 'Forbidden');
  }

  if (!TABLE_INDICES.includes(tableIndex)) {
    return createErrorResponse(400, 'Invalid table index');
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const items = body.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return createErrorResponse(400, 'Invalid items array');
    }

    const enrichedItems = items.map((item: Record<string, unknown>) => ({
      ...item,
      id: item.id || uuidv4(),
      createdAt: item.createdAt || Date.now(),
      updatedAt: item.updatedAt || Date.now(),
      createdBy: item.createdBy || context.userId,
      pk: tableIndex,
      sk: item.id || uuidv4(),
    }));

    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < enrichedItems.length; i += 25) {
      const batch = enrichedItems.slice(i, i + 25);
      const writeRequests = batch.map((item: Record<string, unknown>) => ({
        PutRequest: {
          Item: item,
        },
      }));

      try {
        const params: BatchWriteItemCommandInput = {
          RequestItems: {
            [TABLE_NAME]: writeRequests,
          },
        };

        await client.send(new BatchWriteItemCommand(params));
        imported += batch.length;
      } catch (batchError) {
        failed += batch.length;
        errors.push(`Batch ${Math.floor(i / 25) + 1} failed: ${String(batchError)}`);
      }
    }

    await createAuditLog('BULK_IMPORT', context.userId, {
      tableIndex,
      imported,
      failed,
      total: items.length,
    });

    return createSuccessResponse(200, {
      imported,
      failed,
      errors,
    });
  } catch (error) {
    console.error('Error during bulk import:', error);
    return createErrorResponse(500, 'Internal Server Error');
  }
}

async function handleGetResource(
  event: APIGatewayProxyEvent,
  resourceId: string
): Promise<APIGatewayProxyResult> {
  const context = extractRBACContext(event);
  if (!context) {
    return createErrorResponse(401, 'Unauthorized');
  }

  if (!requirePermission(context.role, 'read:all')) {
    return createErrorResponse(403, 'Forbidden');
  }

  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          pk: 'RESOURCE',
          sk: resourceId,
        },
      })
    );

    if (!result.Item) {
      return createErrorResponse(404, 'Resource not found');
    }

    await createAuditLog('GET_RESOURCE', context.userId, {
      resourceId,
    });

    return createSuccessResponse(200, result.Item);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return createErrorResponse(500, 'Internal Server Error');
  }
}

async function handleCreateResource(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const context = extractRBACContext(event);
  if (!context) {
    return createErrorResponse(401, 'Unauthorized');
  }

  if (!requirePermission(context.role, 'write:all')) {
    return createErrorResponse(403, 'Forbidden');
  }

  try {
    const body = JSON.parse(event.body || '{}');

    if (!body.name || !body.type) {
      return createErrorResponse(400, 'Missing required fields: name, type');
    }

    const resourceId = uuidv4();
    const now = Date.now();

    const resource: Resource = {
      id: resourceId,
      name: body.name,
      type: body.type,
      createdAt: now,
      updatedAt: now,
      createdBy: context.userId,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          pk: 'RESOURCE',
          sk: resourceId,
          ...resource,
        },
      })
    );

    await createAuditLog('CREATE_RESOURCE', context.userId, {
      resourceId,
      resource,
    });

    return createSuccessResponse(201, resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    return createErrorResponse(500, 'Internal Server Error');
  }
}

async function handleUpdateResource(
  event: APIGatewayProxyEvent,
  resourceId: string
): Promise<APIGatewayProxyResult> {
  const context = extractRBACContext(event);
  if (!context) {
    return createErrorResponse(401, 'Unauthorized');
  }

  if (!requirePermission(context.role, 'write:all')) {
    return createErrorResponse(403, 'Forbidden');
  }

  try {
    const body = JSON.parse(event.body || '{}');

    const updateExpression = [];
    const expressionAttributeValues: Record<string, unknown> = {};

    if (body.name) {
      updateExpression.push('#name = :name');
      expressionAttributeValues[':name'] = body.name;
    }

    if (body.type) {
      updateExpression.push('#type = :type');
      expressionAttributeValues[':type'] = body.type;
    }

    updateExpression.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = Date.now();

    if (updateExpression.length === 0) {
      return createErrorResponse(400, 'No fields to update');
    }

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          pk: 'RESOURCE',
          sk: resourceId,
        },
        UpdateExpression: updateExpression.join(', '),
        ExpressionAttributeNames: {
          '#name': 'name',
          '#type': 'type',
        },
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    await createAuditLog('UPDATE_RESOURCE', context.userId, {
      resourceId,
      updates: body,
    });

    return createSuccessResponse(200, result.Attributes);
  } catch (error) {
    console.error('Error updating resource:', error);
    return createErrorResponse(500, 'Internal Server Error');
  }
}

async function handleDeleteResource(
  event: APIGatewayProxyEvent,
  resourceId: string
): Promise<APIGatewayProxyResult> {
  const context = extractRBACContext(event);
  if (!context) {
    return createErrorResponse(401, 'Unauthorized');
  }

  if (!requirePermission(context.role, 'delete:all')) {
    return createErrorResponse(403, 'Forbidden');
  }

  try {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          pk: 'RESOURCE',
          sk: resourceId,
        },
      })
    );

    await createAuditLog('DELETE_RESOURCE', context.userId, {
      resourceId,
    });

    return createSuccessResponse(204, {});
  } catch (error) {
    console.error('Error deleting resource:', error);
    return createErrorResponse(500, 'Internal Server Error');
  }
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const path = event.path || '';
  const method = event.httpMethod || 'GET';

  console.log(`${method} ${path}`);

  if (method === 'GET' && path === '/resources') {
    return handleGetResources(event);
  }

  const resourceMatch = path.match(/^\/resources\/([a-f0-9-]+)$/);
  if (method === 'GET' && resourceMatch) {
    return handleGetResource(event, resourceMatch[1]);
  }

  if (method === 'POST' && path === '/resources') {
    return handleCreateResource(event);
  }

  if (method === 'PUT' && resourceMatch) {
    return handleUpdateResource(event, resourceMatch[1]);
  }

  if (method === 'DELETE' && resourceMatch) {
    return handleDeleteResource(event, resourceMatch[1]);
  }

  const bulkMatch = path.match(/^\/api\/([a-z_]+)\/bulk$/);
  if (method === 'POST' && bulkMatch) {
    return handleBulkImport(event, bulkMatch[1]);
  }

  return createErrorResponse(404, 'Not Found');
};