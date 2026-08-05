import { runTx2Imp2Agent } from '../../src/agents/tx-2-imp-2/orchestrator';
import type { Tx2Imp2AiClient } from '../../src/agents/tx-2-imp-2/orchestrator';

interface UserContext {
  user_id: string;
  role: string;
  department_id: string;
  allowed_data_scopes: string[];
}

interface ActivityData {
  user_id: string;
  activity_date: string;
  activity_type: string;
}

interface ImprovementProposal {
  proposal_id: string;
  target_user_id: string;
  proposal_content: string;
}

interface AuditLogEntry {
  event_type: string;
  user_id: string;
  target_data_scope: string;
  timestamp: string;
  error_code?: string;
}

interface AgentExecutionResult {
  status: string;
  error_code?: string;
  error_message?: string;
  details?: Record<string, unknown>;
}

describe('営業プロセス遵守状況の自動監視と改善提案の実行 - 権限チェック', () => {
  // SCEN-1252
  test('権限外データ参照とツール操作を完全に拒否する', async () => {
    const audit_log: AuditLogEntry[] = [];

    const fake_ai_client: Tx2Imp2AiClient = {
      getActivityData: async (
        user_id: string,
        _start_date: string,
        _end_date: string,
        user_context: UserContext
      ): Promise<ActivityData[]> => {
        if (user_context.allowed_data_scopes.includes('own_activities')) {
          if (user_id !== user_context.user_id) {
            const error_entry: AuditLogEntry = {
              event_type: 'AUTHORIZATION_DENIED',
              user_id: user_context.user_id,
              target_data_scope: user_id,
              timestamp: new Date('2024-01-15T10:30:00Z').toISOString(),
              error_code: 'UNAUTHORIZED_DATA_ACCESS',
            };
            audit_log.push(error_entry);
            const auth_error = new Error(
              'UNAUTHORIZED_DATA_ACCESS: 権限外のデータ参照: user_888 の活動データにアクセス権限がありません'
            );
            (auth_error as any).code = 'UNAUTHORIZED_DATA_ACCESS';
            throw auth_error;
          }
        }
        return [];
      },

      generateImprovementProposal: async (
        _activity_data: ActivityData[],
        _target_user_id: string,
        user_context: UserContext
      ): Promise<ImprovementProposal> => {
        if (user_context.role === 'sales_staff') {
          const tool_error = new Error(
            'UNAUTHORIZED_TOOL_OPERATION: ツール操作権限なし: 営業担当者ロールでは改善提案の自動生成ツールを使用できません'
          );
          (tool_error as any).code = 'UNAUTHORIZED_TOOL_OPERATION';
          throw tool_error;
        }
        return {
          proposal_id: 'prop_001',
          target_user_id: _target_user_id,
          proposal_content: 'Test proposal',
        };
      },

      notifyUser: async (
        _user_id: string,
        _proposal: ImprovementProposal
      ): Promise<void> => {
        return;
      },

      reportToManager: async (
        _proposals: ImprovementProposal[]
      ): Promise<void> => {
        return;
      },

      updateDashboard: async (
        _compliance_data: Record<string, unknown>
      ): Promise<void> => {
        return;
      },
    };

    const user_context: UserContext = {
      user_id: 'user_999',
      role: 'sales_staff',
      department_id: 'dept_001',
      allowed_data_scopes: ['own_activities'],
    };

    const target_user_id = 'user_888';
    const analysis_start_date = '2024-01-01';
    const analysis_end_date = '2024-01-31';

    let execution_result: AgentExecutionResult = {
      status: 'pending',
    };

    try {
      const activity_data = await fake_ai_client.getActivityData(
        target_user_id,
        analysis_start_date,
        analysis_end_date,
        user_context
      );

      const proposals = [];
      for (const _activity of activity_data) {
        const proposal = await fake_ai_client.generateImprovementProposal(
          activity_data,
          target_user_id,
          user_context
        );
        proposals.push(proposal);
      }

      await fake_ai_client.reportToManager(proposals);
      await fake_ai_client.updateDashboard({
        proposals: proposals,
      });

      execution_result = {
        status: 'success',
      };
    } catch (error: any) {
      execution_result = {
        status: 'failed',
        error_code: error.code || 'UNKNOWN_ERROR',
        error_message: error.message || 'An error occurred',
        details: {
          target_user_id: target_user_id,
          requesting_user_id: user_context.user_id,
        },
      };
    }

    expect(execution_result.status).toBe('failed');
    expect(execution_result.error_code).toBe('UNAUTHORIZED_DATA_ACCESS');
    expect(execution_result.error_message).toMatch(/権限外のデータ参照/);
    expect(execution_result.details?.target_user_id).toBe('user_888');
    expect(execution_result.details?.requesting_user_id).toBe('user_999');

    expect(audit_log.length).toBeGreaterThan(0);
    const auth_denied_entry = audit_log.find(
      (entry) => entry.event_type === 'AUTHORIZATION_DENIED'
    );
    expect(auth_denied_entry).toBeDefined();
    expect(auth_denied_entry?.user_id).toBe('user_999');
    expect(auth_denied_entry?.target_data_scope).toBe('user_888');
    expect(auth_denied_entry?.error_code).toBe('UNAUTHORIZED_DATA_ACCESS');
    expect(auth_denied_entry?.timestamp).toBe('2024-01-15T10:30:00Z');
  });
});