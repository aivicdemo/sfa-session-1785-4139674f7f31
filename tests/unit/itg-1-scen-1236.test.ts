import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx1Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-1236
  test('データ抽出から品質検証・クリーニングまでの自動実行 AIエージェント - 権限外のデータ参照とツール操作を拒否する', async () => {
    const unauthorized_user_context = {
      user_id: 'user_001',
      user_role: 'sales_representative',
      permissions: ['view_own_data'],
      access_token: 'invalid_token_insufficient_permissions'
    };

    const extraction_request = {
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      target_sales_people: ['rep_001', 'rep_002']
    };

    const mock_sales_api_response = {
      status: 403,
      error_code: 'ERR_AUTHORIZATION_DENIED',
      error_message: 'ユーザーはこのデータ処理に必要な権限を保有していません'
    };

    const mock_cleaning_rule_response = {
      status: 403,
      error_code: 'ERR_AUTHORIZATION_DENIED',
      error_message: 'ユーザーはこのデータ処理に必要な権限を保有していません'
    };

    const mock_analysis_system_response = {
      status: 403,
      error_code: 'ERR_AUTHORIZATION_DENIED',
      error_message: 'ユーザーはこのデータ処理に必要な権限を保有していません'
    };

    fetchMock.mockResponseOnce(JSON.stringify(mock_sales_api_response), { status: 403 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_cleaning_rule_response), { status: 403 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_analysis_system_response), { status: 403 });

    const mock_ai_client = {
      callAgentAsync: jest.fn(async (prompt: string, context: any) => {
        const auth_check_result = {
          authorization_status: 'denied',
          error_code: 'ERR_AUTHORIZATION_DENIED',
          error_message: 'ユーザーはこのデータ処理に必要な権限を保有していません',
          attempted_operations: [
            {
              operation: 'sales_system_api_access',
              timestamp: '2024-02-15T10:30:00Z',
              user_role: 'sales_representative',
              denied: true
            },
            {
              operation: 'cleaning_rule_reference',
              timestamp: '2024-02-15T10:30:05Z',
              user_role: 'sales_representative',
              denied: true
            },
            {
              operation: 'analysis_system_registration',
              timestamp: '2024-02-15T10:30:10Z',
              user_role: 'sales_representative',
              denied: true
            }
          ],
          process_logs: [
            {
              timestamp: '2024-02-15T10:30:00Z',
              event: '権限外アクセス試行',
              target_api: 'sales_system/extract',
              user_role: 'sales_representative',
              request_id: 'req_001'
            },
            {
              timestamp: '2024-02-15T10:30:05Z',
              event: '権限外アクセス試行',
              target_api: 'cleaning_rules/reference',
              user_role: 'sales_representative',
              request_id: 'req_002'
            },
            {
              timestamp: '2024-02-15T10:30:10Z',
              event: '権限外アクセス試行',
              target_api: 'analysis_system/register',
              user_role: 'sales_representative',
              request_id: 'req_003'
            }
          ],
          partial_effects_rollback_state: 'no_operations_executed',
          escalation_condition: 'authorization_denied'
        };
        return auth_check_result;
      })
    };

    const execution_result = await runTx1Imp1Agent(
      extraction_request,
      unauthorized_user_context,
      mock_ai_client as any
    );

    expect(execution_result.authorization_status).toBe('denied');
    expect(execution_result.error_code).toBe('ERR_AUTHORIZATION_DENIED');
    expect(execution_result.error_message).toBe('ユーザーはこのデータ処理に必要な権限を保有していません');

    expect(execution_result.attempted_operations).toHaveLength(3);
    expect(execution_result.attempted_operations[0]).toEqual({
      operation: 'sales_system_api_access',
      timestamp: '2024-02-15T10:30:00Z',
      user_role: 'sales_representative',
      denied: true
    });
    expect(execution_result.attempted_operations[1]).toEqual({
      operation: 'cleaning_rule_reference',
      timestamp: '2024-02-15T10:30:05Z',
      user_role: 'sales_representative',
      denied: true
    });
    expect(execution_result.attempted_operations[2]).toEqual({
      operation: 'analysis_system_registration',
      timestamp: '2024-02-15T10:30:10Z',
      user_role: 'sales_representative',
      denied: true
    });

    expect(execution_result.process_logs).toHaveLength(3);
    expect(execution_result.process_logs[0]).toEqual({
      timestamp: '2024-02-15T10:30:00Z',
      event: '権限外アクセス試行',
      target_api: 'sales_system/extract',
      user_role: 'sales_representative',
      request_id: 'req_001'
    });
    expect(execution_result.process_logs[1]).toEqual({
      timestamp: '2024-02-15T10:30:05Z',
      event: '権限外アクセス試行',
      target_api: 'cleaning_rules/reference',
      user_role: 'sales_representative',
      request_id: 'req_002'
    });
    expect(execution_result.process_logs[2]).toEqual({
      timestamp: '2024-02-15T10:30:10Z',
      event: '権限外アクセス試行',
      target_api: 'analysis_system/register',
      user_role: 'sales_representative',
      request_id: 'req_003'
    });

    expect(execution_result.partial_effects_rollback_state).toBe('no_operations_executed');
    expect(execution_result.escalation_condition).toBe('authorization_denied');

    expect(mock_ai_client.callAgentAsync).toHaveBeenCalledTimes(1);
  });
});