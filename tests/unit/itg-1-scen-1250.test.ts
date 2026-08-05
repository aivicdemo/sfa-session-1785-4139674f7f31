import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  runTx2Imp2Agent,
  Tx2Imp2AiClient,
  SalesActivityInput,
  ProcessComplianceResult,
  EscalationEvent,
  AuditTrailEntry,
  ManagerReviewRequest,
} from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  let mockAiClient: jest.Mocked<Tx2Imp2AiClient>;

  beforeEach(() => {
    mockAiClient = {
      generateImprovementProposal: jest.fn(),
      validateProposalOutput: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1250
  test('不正・曖昧・低確信度のAI出力を拒否して安全に引き継ぐ', async () => {
    const salesActivityInput: SalesActivityInput = {
      sales_rep_id: 'SR001',
      process_compliance_rate: 72,
      improvement_opportunities_count: 3,
      timestamp: '2024-01-15T11:00:00Z',
    };

    const malformedAiOutput = {
      malformed_response: undefined,
      confidence: null,
    };

    mockAiClient.generateImprovementProposal.mockResolvedValueOnce(
      malformedAiOutput as any
    );

    const result = await runTx2Imp2Agent(
      salesActivityInput,
      mockAiClient,
      'MGR001'
    );

    expect(result.process_compliance_result).toBeDefined();
    expect(result.process_compliance_result.sales_rep_id).toBe('SR001');
    expect(result.process_compliance_result.compliance_rate).toBe(72);

    expect(result.escalation_event).toBeDefined();
    expect(result.escalation_event.escalation_type).toBe(
      'LOW_CONFIDENCE_AI_OUTPUT'
    );
    expect(result.escalation_event.detected_confidence).toBeNull();
    expect(result.escalation_event.rejected_proposal_count).toBe(1);
    expect(result.escalation_event.timestamp).toBe('2024-01-15T11:00:00Z');

    expect(result.manager_review_request).toBeDefined();
    expect(result.manager_review_request.manager_id).toBe('MGR001');
    expect(result.manager_review_request.status).toBe(
      'AWAITING_MANAGER_REVIEW'
    );
    expect(result.manager_review_request.reason).toBe(
      'AI_OUTPUT_VALIDATION_FAILED'
    );
    expect(result.manager_review_request.sales_rep_id).toBe('SR001');

    expect(result.dashboard_proposal_queue).toBeDefined();
    expect(result.dashboard_proposal_queue.length).toBe(1);
    expect(result.dashboard_proposal_queue[0].status).toBe(
      'REJECTED_LOW_CONFIDENCE'
    );
    expect(result.dashboard_proposal_queue[0].sales_rep_id).toBe('SR001');

    expect(result.audit_trail).toBeDefined();
    expect(result.audit_trail.length).toBeGreaterThanOrEqual(1);

    const rejectionAuditEntry = result.audit_trail.find(
      (entry: AuditTrailEntry) => entry.event_type === 'AI_OUTPUT_REJECTION'
    );
    expect(rejectionAuditEntry).toBeDefined();
    expect(rejectionAuditEntry.sales_rep_id).toBe('SR001');
    expect(rejectionAuditEntry.rejection_reason).toBe(
      'MALFORMED_RESPONSE_AND_LOW_CONFIDENCE'
    );
    expect(rejectionAuditEntry.escalation_flag).toBe(true);
    expect(rejectionAuditEntry.timestamp).toBe('2024-01-15T11:00:00Z');

    expect(result.proposal_notification_sent).toBe(false);
    expect(result.safety_handoff_status).toBe('ESCALATED_FOR_MANAGER_REVIEW');
  });
});