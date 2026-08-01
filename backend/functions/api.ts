import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { extractAuthContext, checkPermission, AuthContext } from './rbac';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-northeast-1' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.MAIN_TABLE || 'SalesAuditTable';

const TABLE_INDICES = [
  'LoginUser',
  'SalesPerson',
  'Customer',
  'SalesOpportunity',
  'SalesActivity',
  'SalesActivityLog',
  'ContractResult',
  'BehaviorPatternAnalysis',
  'AIAgentInferenceLog',
  'AIAgentInferencePrecision',
  'AlertSetting',
  'AlertHistory',
  'SalesProcessDefinition',
  'SalesProcessExecution',
  'ReportGenerationHistory',
  'DashboardSetting',
];

interface AuditLog {
  pk: string;
  sk: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: number;
  details: Record<string, unknown>;
}

function createAuditLog(
  auth: AuthContext,
  action: string,
  details: Record<string, unknown>
): AuditLog {
  return {
    pk: 'AUDIT',
    sk: `${Date.now()}#${randomUUID()}`,
    action,
    userId: auth.userId,
    userName: auth.userName,
    timestamp: Date.now(),
    details,
  };
}

async function recordAudit(auditLog: AuditLog): Promise<void> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: auditLog,
      })
    );
  } catch (error) {
    console.error('Failed to record audit log:', error);
  }
}

function errorResponse(statusCode: number, message: string): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: message }),
  };
}

function successResponse(statusCode: number, data: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
}

async function handleGetResources(
  event: APIGatewayProxyEvent,
  auth: AuthContext
): Promise<APIGatewayProxyResult> {
  try {
    const tableIndex = event.pathParameters?.tableIndex;
    const id = event.pathParameters?.id;

    if (tableIndex && id) {
      const tableName = TABLE_INDICES[parseInt(tableIndex, 10)];
      if (!tableName) {
        return errorResponse(404, 'Table not found');
      }

      const result = await docClient.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: { pk: tableName, sk: id },
        })
      );

      if (!result.Item) {
        return errorResponse(404, 'Resource not found');
      }

      return successResponse(200, result.Item);
    }

    if (tableIndex) {
      const tableName = TABLE_INDICES[parseInt(tableIndex, 10)];
      if (!tableName) {
        return errorResponse(404, 'Table not found');
      }

      const result = await docClient.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: 'pk = :pk',
          ExpressionAttributeValues: { ':pk': tableName },
        })
      );

      return successResponse(200, {
        items: result.Items || [],
        count: result.Count || 0,
      });
    }

    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'attribute_not_exists(pk) OR pk <> :audit',
        ExpressionAttributeValues: { ':audit': 'AUDIT' },
      })
    );

    return successResponse(200, {
      items: result.Items || [],
      count: result.Count || 0,
    });
  } catch (error) {
    console.error('Error in handleGetResources:', error);
    return errorResponse(500, 'Internal server error');
  }
}

async function handleBulkImport(
  event: APIGatewayProxyEvent,
  auth: AuthContext
): Promise<APIGatewayProxyResult> {
  try {
    const tableIndex = parseInt(event.pathParameters?.tableIndex || '-1', 10);
    if (tableIndex < 0 || tableIndex >= TABLE_INDICES.length) {
      return errorResponse(404, 'Table not found');
    }

    const tableName = TABLE_INDICES[tableIndex];
    const body = JSON.parse(event.body || '{}');
    const items = body.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse(400, 'Invalid request: items must be a non-empty array');
    }

    const now = Date.now();
    const processedItems = items.map((item: Record<string, unknown>) => ({
      pk: tableName,
      sk: item.id || randomUUID(),
      ...item,
      createdAt: item.createdAt || now,
      updatedAt: item.updatedAt || now,
    }));

    const chunks = [];
    for (let i = 0; i < processedItems.length; i += 25) {
      chunks.push(processedItems.slice(i, i + 25));
    }

    let imported = 0;
    const errors: string[] = [];

    for (const chunk of chunks) {
      try {
        const requestItems: Record<string, unknown>[] = [];
        for (const item of chunk) {
          requestItems.push({
            PutRequest: {
              Item: item,
            },
          });
        }

        await docClient.send(
          new BatchWriteCommand({
            RequestItems: {
              [TABLE_NAME]: requestItems as any,
            },
          })
        );

        imported += chunk.length;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Chunk error: ${errorMsg}`);
      }
    }

    const auditLog = createAuditLog(auth, 'BULK_IMPORT', {
      tableIndex,
      tableName,
      imported,
      failed: items.length - imported,
      totalRequested: items.length,
    });
    await recordAudit(auditLog);

    return successResponse(200, {
      imported,
      failed: items.length - imported,
      errors,
    });
  } catch (error) {
    console.error('Error in handleBulkImport:', error);
    return errorResponse(500, 'Internal server error');
  }
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const auth = extractAuthContext(event);
  const method = event.httpMethod || 'GET';
  const path = event.path || '/';

  if (!checkPermission(auth, method, path)) {
    return errorResponse(403, 'Forbidden');
  }

  if (method === 'GET' && path === '/resources') {
    return handleGetResources(event, auth!);
  }

  if (method === 'POST' && path.match(/^\/api\/\d+\/bulk$/)) {
    return handleBulkImport(event, auth!);
  }

  return errorResponse(404, 'Not found');
}