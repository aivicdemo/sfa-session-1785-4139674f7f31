import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx11Imp1Agent } from '../../src/agents/tx-11-imp-1/orchestrator';

interface MockAiClientOutput {
  confidence_score: number;
  category: string | null;
  description: string;
  success_factors?: string[];
  failure_factors?: string[];
}

interface ValidationError {
  field: string;
  reason: string;
  actual_value: unknown;
}

interface AuditEvent {
  event_type: string;
  validation_errors?: ValidationError[];
  severity?: string;
  timestamp: string;
}

interface Tx11Imp1AiClient {
  extractAndClassifyCaseData(caseId: string, caseData: unknown): Promise<MockAiClientOutput>;
}

interface RunTx11Imp1AgentResult {
  success: boolean;
  escalated: boolean;
  escalation_reason?: string;
  case_id: string;
  human_review_queue_id?: string;
  ai_output_rejected_at?: string;
  rejected_ai_output?: MockAiClientOutput;
}

interface AuditLog {
  events: AuditEvent[];
  addEvent(event: AuditEvent): void;
}

class MockAuditLog implements AuditLog {
  events: AuditEvent[] = [];

  addEvent(event: AuditEvent): void {
    this.events.push({
      ...event,
      timestamp: new Date().toISOString(),
    });
  }
}

class FakeTx11Imp1AiClient implements Tx11Imp1AiClient {
  private output: MockAiClientOutput;

  constructor(output: MockAiClientOutput) {
    this.output = output;
  }

  async extractAndClassifyCaseData(
    caseId: string,
    caseData: unknown
  ): Promise<MockAiClientOutput> {
    return this.output;
  }
}

describe('営業事例の収集・分類・言語化の自動化と例外時のみ人による確認', () => {
  let audit_log: AuditLog;

  beforeEach(() => {
    audit_log = new MockAuditLog();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1302
  test('低確信度・不正・曖昧なAI出力を拒否してエスカレーションを実行する', async () => {
    const case_id = 'TEST-001';
    const input_case_data = {
      case_id: case_id,
      customer_industry: 'IT',
      proposal_amount: 5000000,
      contracted: true,
    };

    const low_confidence_output: MockAiClientOutput = {
      confidence_score: 0.65,
      category: 'Success',
      description: '良い営業だった',
      success_factors: ['営業スキル'],
      failure_factors: [],
    };

    const fake_ai_client = new FakeTx11Imp1AiClient(low_confidence_output);

    const result: RunTx11Imp1AgentResult = await runTx11Imp1Agent({
      case_id: case_id,
      case_data: input_case_data,
      ai_client: fake_ai_client,
      audit_log: audit_log,
      confidence_threshold: 0.8,
      required_business_terms: ['営業', 'プロセス', '提案', '顧客', '成約', '要因', '市場'],
    });

    expect(result.success).toBe(false);
    expect(result.escalated).toBe(true);
    expect(result.case_id).toBe('TEST-001');

    expect(result.escalation_reason).toContain('精度スコア');
    expect(result.escalation_reason).toContain('0.65');
    expect(result.escalation_reason).toContain('0.8');

    expect(result.human_review_queue_id).toBeDefined();
    expect(typeof result.human_review_queue_id).toBe('string');
    expect(result.human_review_queue_id?.length).toBeGreaterThan(0);

    expect(result.ai_output_rejected_at).toBeDefined();
    expect(typeof result.ai_output_rejected_at).toBe('string');

    expect(result.rejected_ai_output).toEqual(low_confidence_output);

    const validation_failed_events = audit_log.events.filter(
      (e) => e.event_type === 'tx_11_imp_1.validation_failed'
    );
    expect(validation_failed_events.length).toBeGreaterThan(0);

    const validation_event = validation_failed_events[0];
    expect(validation_event.severity).toBe('escalation');
    expect(Array.isArray(validation_event.validation_errors)).toBe(true);
    expect(validation_event.validation_errors!.length).toBeGreaterThan(0);

    const confidence_error = validation_event.validation_errors!.find(
      (e) => e.field === 'confidence_score'
    );
    expect(confidence_error).toBeDefined();
    expect(confidence_error!.reason).toContain('閾値');

    const escalation_triggered_events = audit_log.events.filter(
      (e) => e.event_type === 'tx_11_imp_1.escalation_triggered'
    );
    expect(escalation_triggered_events.length).toBeGreaterThan(0);

    expect(audit_log.events.length).toBeGreaterThanOrEqual(2);
  });
});