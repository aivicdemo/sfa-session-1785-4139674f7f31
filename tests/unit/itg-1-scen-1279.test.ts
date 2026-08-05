import { runTx10Imp1Agent } from '../../src/logic/it-1';

// Mock AI client interface
interface Tx10Imp1AiClient {
  detectInappropriatePatterns: (input: {
    customer_name: string;
    proposed_amount: number;
    proposal_content: string;
    contract_conditions: string;
    customer_budget_limit: number;
  }) => Promise<{
    risk_factors: Array<{ id: string; score: number; description: string }>;
    constraint_violations: Array<{ id: string; score: number; description: string }>;
    quality_deficiencies: Array<{ id: string; score: number; description: string }>;
  }>;
}

// Mock notification service
interface NotificationService {
  send: (params: {
    recipient_user_ids: string[];
    message: string;
    alert_id: string;
    detected_at: string;
  }) => Promise<{ success: boolean }>;
}

// Mock audit logger
interface AuditLogger {
  record: (params: {
    event_type: string;
    execution_time: string;
    process_content: string;
    detected_pattern_count: number;
    notification_recipients: string[];
  }) => Promise<void>;
}

describe('営業プロセス実行状況の監査ダッシュボード - Tx10Imp1Agent', () => {
  // SCEN-1279
  test('should execute complete autonomous flow from sales data input to alert notification with inappropriate pattern detection', async () => {
    const start_time = new Date('2024-01-15T11:00:00Z');
    const manager_user_id = 'user_mgr_001';
    const sales_user_id = 'user_sales_001';
    const alert_id = 'alert_20240115_001';

    // Test data: sales input with customer constraints
    const sales_input_data = {
      customer_name: 'Acme Corp',
      proposed_amount: 150000,
      proposal_content: 'Enterprise solution upgrade without detailed ROI analysis',
      contract_conditions: 'Payment in 12 months with early termination clause',
      customer_budget_limit: 100000,
      customer_id: 'cust_001',
      sales_person_id: sales_user_id,
    };

    // Mock AI Client: detectInappropriatePatterns
    const mock_ai_client: Tx10Imp1AiClient = {
      detectInappropriatePatterns: jest.fn(async (input) => {
        return {
          risk_factors: [
            {
              id: 'risk_001',
              score: 85,
              description: 'Proposed amount exceeds customer budget limit by 50%',
            },
          ],
          constraint_violations: [
            {
              id: 'constraint_001',
              score: 92,
              description: 'Early termination clause violates standard contract rules',
            },
          ],
          quality_deficiencies: [
            {
              id: 'quality_001',
              score: 78,
              description: 'Proposal content lacks ROI analysis and business case justification',
            },
          ],
        };
      }),
    };

    // Mock Notification Service
    const mock_notification_service: NotificationService = {
      send: jest.fn(async (params) => {
        return { success: true };
      }),
    };

    // Mock Audit Logger
    const mock_audit_logger: AuditLogger = {
      record: jest.fn(async (params) => {
        // Audit logging
      }),
    };

    // Create execution context with mocks
    const execution_context = {
      ai_client: mock_ai_client,
      notification_service: mock_notification_service,
      audit_logger: mock_audit_logger,
      sla_max_execution_ms: 5000,
    };

    // Execute agent
    const agent_start_ms = Date.now();
    const result = await runTx10Imp1Agent(sales_input_data, execution_context);
    const agent_execution_ms = Date.now() - agent_start_ms;

    // Verify: AI client was called for pattern detection
    expect(mock_ai_client.detectInappropriatePatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_name: 'Acme Corp',
        proposed_amount: 150000,
        customer_budget_limit: 100000,
      })
    );

    // Verify: Result contains success status
    expect(result.status).toBe('success');

    // Verify: Detected patterns count is 3
    expect(result.detected_pattern_count).toBe(3);

    // Verify: Risk factor score meets threshold (80+)
    const risk_factor = result.detected_patterns.find((p: any) => p.pattern_type === 'risk_factor');
    expect(risk_factor).toBeDefined();
    expect(risk_factor.score).toBeGreaterThanOrEqual(80);
    expect(risk_factor.score).toBe(85);

    // Verify: Constraint violation score meets threshold (90+)
    const constraint_violation = result.detected_patterns.find(
      (p: any) => p.pattern_type === 'constraint_violation'
    );
    expect(constraint_violation).toBeDefined();
    expect(constraint_violation.score).toBeGreaterThanOrEqual(90);
    expect(constraint_violation.score).toBe(92);

    // Verify: Quality deficiency score meets threshold (70+)
    const quality_deficiency = result.detected_patterns.find(
      (p: any) => p.pattern_type === 'quality_deficiency'
    );
    expect(quality_deficiency).toBeDefined();
    expect(quality_deficiency.score).toBeGreaterThanOrEqual(70);
    expect(quality_deficiency.score).toBe(78);

    // Verify: Alert object contains all 3 pattern types
    expect(result.alert_details).toBeDefined();
    expect(result.alert_details.alert_id).toBeTruthy();
    expect(result.alert_details.patterns_detected).toContain('リスク要因検出');
    expect(result.alert_details.patterns_detected).toContain('制約違反検出');
    expect(result.alert_details.patterns_detected).toContain('品質不足検出');

    // Verify: Notification was sent to both manager and sales person
    expect(mock_notification_service.send).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient_user_ids: expect.arrayContaining([manager_user_id, sales_user_id]),
        alert_id: expect.any(String),
        detected_at: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
        ),
      })
    );

    // Verify: Notification message contains problem description and recommended action
    const notification_call_args = (mock_notification_service.send as jest.Mock).mock
      .calls[0][0];
    expect(notification_call_args.message).toContain('リスク要因');
    expect(notification_call_args.message).toContain('制約違反');
    expect(notification_call_args.message).toContain('推奨対応');

    // Verify: Audit log was recorded with AGENT_EXEC_SUCCESS
    expect(mock_audit_logger.record).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: 'AGENT_EXEC_SUCCESS',
        detected_pattern_count: 3,
        notification_recipients: expect.arrayContaining([manager_user_id, sales_user_id]),
      })
    );

    // Verify: Audit log contains execution time and process content
    const audit_call_args = (mock_audit_logger.record as jest.Mock).mock.calls[0][0];
    expect(audit_call_args.execution_time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    expect(audit_call_args.process_content).toContain('データ品質検証');
    expect(audit_call_args.process_content).toContain('提案内容分析');
    expect(audit_call_args.process_content).toContain('不適切パターン検出');

    // Verify: Response contains alert ID and execution timestamp
    expect(result.alert_id).toBeTruthy();
    expect(result.executed_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);

    // Verify: SLA requirement met (execution time < 5000ms)
    expect(agent_execution_ms).toBeLessThan(5000);

    // Verify: Detected patterns include descriptions for all pattern types
    expect(result.detected_patterns.every((p: any) => p.description)).toBe(true);

    // Verify: All detected patterns have pattern_type field
    const valid_pattern_types = ['risk_factor', 'constraint_violation', 'quality_deficiency'];
    expect(result.detected_patterns.every((p: any) => valid_pattern_types.includes(p.pattern_type)))
      .toBe(true);
  });
});