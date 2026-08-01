import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  DynamoDBClient,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { extractAuthContext, requirePermission, Role } from './rbac';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-northeast-1' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.MAIN_TABLE || 'SalesAuditSystem';

interface AuditLog {
  pk: string;
  sk: string;
  action: string;
  userId: string;
  loginId: string;
  timestamp: number;
  details: Record<string, unknown>;
}

interface ApiResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

function createResponse(statusCode: number, data: unknown): ApiResponse {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };
}

async function createAuditLog(
  action: string,
  userId: string,
  loginId: string,
  details: Record<string, unknown>
): Promise<void> {
  const auditLog: AuditLog = {
    pk: 'AUDIT',
    sk: `${Date.now()}#${uuidv4()}`,
    action,
    userId,
    loginId,
    timestamp: Date.now(),
    details,
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: auditLog,
    })
  );
}

function getTableIndexFromPath(path: string): string {
  const match = path.match(/\/api\/([^\/]+)/);
  return match ? match[1] : '';
}

function getTableNameFromIndex(index: string): string {
  const tableMap: Record<string, string> = {
    'login-users': 'ログインユーザー',
    'sales-staff': '営業担当者',
    'customers': '顧客',
    'sales-opportunities': '営業案件',
    'sales-activities': '営業活動',
    'sales-activity-logs': '営業活動ログ',
    'contract-results': '成約実績',
    'behavior-analysis': '行動パターン分析結果',
    'ai-inference-logs': 'AIエージェント推論ログ',
    'ai-inference-accuracy': 'AIエージェント推論精度監視',
    'alert-settings': 'アラート設定',
    'alert-history': 'アラート履歴',
    'process-definitions': '営業プロセス定義',
    'process-execution': '営業プロセス実行状況',
    'report-history': 'レポート生成履歴',
    'dashboard-settings': 'ダッシュボード設定',
  };
  return tableMap[index] || index;
}

export async function handler(event: APIGatewayProxyEvent): Promise<ApiResponse> {
  try {
    const path = event.path || '';
    const method = event.httpMethod || 'GET';
    const tableIndex = getTableIndexFromPath(path);
    const tableName = getTableNameFromIndex(tableIndex);

    let authContext;
    try {
      authContext = extractAuthContext(event);
    } catch (error) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    // GET /resources - List all resources
    if (method === 'GET' && path === '/resources') {
      requirePermission(authContext.role, 'GET_RESOURCES');

      const result = await docClient.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          Limit: 100,
        })
      );

      return createResponse(200, {
        items: result.Items || [],
        count: result.Count || 0,
      });
    }

    // GET /api/{tableIndex} - List resources by table
    if (method === 'GET' && path.match(/\/api\/[^\/]+$/) && !path.includes('bulk')) {
      requirePermission(authContext.role, 'GET_RESOURCES');

      const result = await docClient.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: 'attribute_exists(#table)',
          ExpressionAttributeNames: { '#table': 'table' },
          Limit: 100,
        })
      );

      return createResponse(200, {
        items: result.Items || [],
        count: result.Count || 0,
      });
    }

    // GET /api/{tableIndex}/{id} - Get single resource
    if (method === 'GET' && path.match(/\/api\/[^\/]+\/[^\/]+$/) && !path.includes('bulk')) {
      requirePermission(authContext.role, 'GET_RESOURCES');

      const id = event.pathParameters?.id;
      if (!id) {
        return createResponse(400, { error: 'Missing resource ID' });
      }

      const result = await docClient.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: { pk: tableName, sk: id },
        })
      );

      if (!result.Item) {
        return createResponse(404, { error: 'Resource not found' });
      }

      return createResponse(200, result.Item);
    }

    // POST /api/{tableIndex} - Create resource
    if (method === 'POST' && path.match(/\/api\/[^\/]+$/) && !path.includes('bulk')) {
      requirePermission(authContext.role, 'POST_RESOURCES');

      const body = JSON.parse(event.body || '{}');
      const id = body.id || uuidv4();
      const now = Date.now();

      const item = {
        pk: tableName,
        sk: id,
        ...body,
        createdAt: now,
        updatedAt: now,
        createdBy: authContext.userId,
        updatedBy: authContext.userId,
      };

      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
        })
      );

      await createAuditLog('CREATE', authContext.userId, authContext.loginId, {
        table: tableName,
        id,
        item,
      });

      return createResponse(201, item);
    }

    // PUT /api/{tableIndex}/{id} - Update resource
    if (method === 'PUT' && path.match(/\/api\/[^\/]+\/[^\/]+$/) && !path.includes('bulk')) {
      requirePermission(authContext.role, 'PUT_RESOURCES');

      const id = event.pathParameters?.id;
      if (!id) {
        return createResponse(400, { error: 'Missing resource ID' });
      }

      const body = JSON.parse(event.body || '{}');
      const now = Date.now();

      const updateExpression = Object.keys(body)
        .map((key, index) => `#key${index} = :val${index}`)
        .join(', ');

      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, unknown> = {};

      Object.entries(body).forEach(([key, value], index) => {
        expressionAttributeNames[`#key${index}`] = key;
        expressionAttributeValues[`:val${index}`] = value;
      });

      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeNames['#updatedBy'] = 'updatedBy';
      expressionAttributeValues[':updatedAt'] = now;
      expressionAttributeValues[':updatedBy'] = authContext.userId;

      const finalUpdateExpression = `${updateExpression}, #updatedAt = :updatedAt, #updatedBy = :updatedBy`;

      const result = await docClient.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { pk: tableName, sk: id },
          UpdateExpression: finalUpdateExpression,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        })
      );

      await createAuditLog('UPDATE', authContext.userId, authContext.loginId, {
        table: tableName,
        id,
        updates: body,
      });

      return createResponse(200, result.Attributes);
    }

    // DELETE /api/{tableIndex}/{id} - Delete resource
    if (method === 'DELETE' && path.match(/\/api\/[^\/]+\/[^\/]+$/) && !path.includes('bulk')) {
      requirePermission(authContext.role, 'DELETE_RESOURCES');

      const id = event.pathParameters?.id;
      if (!id) {
        return createResponse(400, { error: 'Missing resource ID' });
      }

      await docClient.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: { pk: tableName, sk: id },
        })
      );

      await createAuditLog('DELETE', authContext.userId, authContext.loginId, {
        table: tableName,
        id,
      });

      return createResponse(204, {});
    }

    // POST /api/{tableIndex}/bulk - Bulk import
    if (method === 'POST' && path.includes('/bulk')) {
      if (authContext.role === 'viewer') {
        return createResponse(403, { error: 'Forbidden: Bulk import not allowed for viewer role' });
      }

      requirePermission(authContext.role, 'BULK_IMPORT');

      const body = JSON.parse(event.body || '{}');
      const items = body.items || [];

      if (!Array.isArray(items) || items.length === 0) {
        return createResponse(400, { error: 'Invalid items array' });
      }

      const now = Date.now();
      const processedItems = items.map((item: Record<string, unknown>) => ({
        ...item,
        pk: tableName,
        sk: item.id || uuidv4(),
        createdAt: now,
        updatedAt: now,
        createdBy: authContext.userId,
        updatedBy: authContext.userId,
      }));

      let imported = 0;
      let failed = 0;
      const errors: string[] = [];

      // Process in batches of 25 (DynamoDB BatchWriteItem limit)
      for (let i = 0; i < processedItems.length; i += 25) {
        const batch = processedItems.slice(i, i + 25);
        const requestItems: BatchWriteItemCommandInput['RequestItems'] = {
          [TABLE_NAME]: batch.map((item) => ({
            PutRequest: {
              Item: item,
            },
          })),
        };

        try {
          const result = await client.send(
            new BatchWriteItemCommand({
              RequestItems: requestItems,
            })
          );

          imported += batch.length - (result.UnprocessedItems?.[TABLE_NAME]?.length || 0);
          failed += result.UnprocessedItems?.[TABLE_NAME]?.length || 0;

          if (result.UnprocessedItems?.[TABLE_NAME]) {
            errors.push(`Batch ${Math.floor(i / 25) + 1}: Some items failed to write`);
          }
        } catch (error) {
          failed += batch.length;
          errors.push(`Batch ${Math.floor(i / 25) + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      await createAuditLog('BULK_IMPORT', authContext.userId, authContext.loginId, {
        table: tableName,
        imported,
        failed,
        totalRequested: items.length,
      });

      return createResponse(200, {
        imported,
        failed,
        errors,
      });
    }

    return createResponse(404, { error: 'Not found' });
  } catch (error) {
    console.error('Error:', error);

    if (error instanceof Error && error.message.includes('Forbidden')) {
      return createResponse(403, { error: error.message });
    }

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return createResponse(401, { error: error.message });
    }

    return createResponse(500, {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}