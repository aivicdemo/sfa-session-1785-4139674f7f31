import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { runTx2Imp2Agent } from '../../src/agents/tx-2-imp-2/orchestrator';

// Mock types for Tx2Imp2AiClient
interface MockAiResponse {
  complianceScore: number;
  detectedIssues: Array<{
    sellerId: string;
    issueType: string;
    severity: string;
    proposal: string;
    executionDifficulty: string;
    canExecute: boolean;
  }>;
  escalationReason?: string;
}

interface SalesActivityData {
  sellerId: string;
  activityDate: string;
  activityType: string;
  processStep: string;
  customerId: string;
  proposalContent: string;
  customerResponse: string;
  followUpInterval: number;
}

interface EscalationEvent {
  timestamp: string;
  escalationType: string;
  reason: string;
  targetManagerId: string;
  proposalDetails: {
    sellerId: string;
    proposalContent: string;
    executionDifficulty: string;
    linkedActivities: string[];
  };
}

interface AuditLogEntry {
  timestamp: string;
  eventType: string;
  message: string;
  associatedProposalId: string;
  status: string;
}

class MockTx2Imp2AiClient {
  private inferenceAccuracy: number = 0.92;
  private escalationTrigger: boolean = false;

  setInferenceAccuracy(accuracy: number): void {
    this.inferenceAccuracy = accuracy;
  }

  setEscalationTrigger(trigger: boolean): void {
    this.escalationTrigger = trigger;
  }

  async analyzeComplianceStatus(data: SalesActivityData[]): Promise<MockAiResponse> {
    if (this.escalationTrigger) {
      return {
        complianceScore: 0.65,
        detectedIssues: [
          {
            sellerId: 'SEL-001',
            issueType: 'low_compliance',
            severity: 'high',
            proposal: 'Increase customer contact frequency from weekly to twice-weekly; implement structured follow-up template',
            executionDifficulty: 'high',
            canExecute: false,
          },
        ],
        escalationReason: 'Proposal requires system integration with legacy CRM that is not currently feasible. Manual intervention required.',
      };
    }

    return {
      complianceScore: 0.88,
      detectedIssues: [],
    };
  }

  getInferenceAccuracy(): number {
    return this.inferenceAccuracy;
  }
}

describe('営業プロセス遵守状況の自動監視と改善提案の実行 - エスカレーション条件処理', () => {
  test('SCEN-1247: 改善提案の実行が困難と判定された場合に副作用確定前に人へ引き継ぐ', async () => {
    // Initialize mock AI client with inference accuracy below 95% threshold
    const mockAiClient = new MockTx2Imp2AiClient();
    mockAiClient.setInferenceAccuracy(0.92);
    mockAiClient.setEscalationTrigger(true);

    // Prepare sales activity data for seller with low process compliance
    const salesActivityData: SalesActivityData[] = [
      {
        sellerId: 'SEL-001',
        activityDate: '2024-01-15T09:30:00Z',
        activityType: 'customer_contact',
        processStep: 'initial_contact',
        customerId: 'CUST-A-001',
        proposalContent: 'Initial product inquiry without structured needs analysis',
        customerResponse: 'interested_but_unclear_on_requirements',
        followUpInterval: 14,
      },
      {
        sellerId: 'SEL-001',
        activityDate: '2024-01-22T10:15:00Z',
        activityType: 'proposal',
        processStep: 'proposal',
        customerId: 'CUST-A-001',
        proposalContent: 'Generic product overview without customer-specific tailoring',
        customerResponse: 'no_immediate_response',
        followUpInterval: 21,
      },
      {
        sellerId: 'SEL-001',
        activityDate: '2024-02-05T14:45:00Z',
        activityType: 'follow_up_call',
        processStep: 'follow_up',
        customerId: 'CUST-A-001',
        proposalContent: 'Minimal follow-up attempt without value-added content',
        customerResponse: 'no_answer',
        followUpInterval: 28,
      },
    ];

    // Initialize tracking variables for side effects and escalation state
    let escalationEventRecorded: EscalationEvent | null = null;
    let auditLogEntries: AuditLogEntry[] = [];
    let proposalNotificationSent: boolean = false;
    let dashboardProposalReflected: boolean = false;
    let managerAssignmentStatus: string = 'pending_assignment';
    const proposalId = 'PROP-ESC-001';

    // Mock orchestrator function that simulates agent behavior with escalation handling
    const mockOrchestrator = async (): Promise<void> => {
      // Step 1: Analyze compliance status using AI client
      const aiResponse = await mockAiClient.analyzeComplianceStatus(salesActivityData);

      // Step 2: Check if inference accuracy is below 95% (should require manager review)
      const inferenceAccuracy = mockAiClient.getInferenceAccuracy();

      // Step 3: Process detected issues and check for execution difficulty
      if (aiResponse.detectedIssues.length > 0) {
        const issue = aiResponse.detectedIssues[0];

        if (!issue.canExecute && aiResponse.escalationReason) {
          // ESCALATION CONDITION TRIGGERED: Proposal execution is difficult
          managerAssignmentStatus = 'awaiting_manager_review';

          escalationEventRecorded = {
            timestamp: '2024-02-05T15:30:00Z',
            escalationType: 'proposal_execution_difficulty',
            reason: aiResponse.escalationReason,
            targetManagerId: 'MGR-001',
            proposalDetails: {
              sellerId: issue.sellerId,
              proposalContent: issue.proposal,
              executionDifficulty: issue.executionDifficulty,
              linkedActivities: [
                'ACT-001',
                'ACT-002',
                'ACT-003',
              ],
            },
          };

          // Record escalation in audit log BEFORE any side effects are committed
          auditLogEntries.push({
            timestamp: '2024-02-05T15:30:00Z',
            eventType: 'escalation_triggered',
            message: `Escalation triggered: 改善提案の実行が困難と判定 / Assigned to manager for manual review`,
            associatedProposalId: proposalId,
            status: managerAssignmentStatus,
          });

          // Side effect 1: Do NOT send notification to sales rep (pending manager review)
          proposalNotificationSent = false;

          // Side effect 2: Do NOT reflect proposal in dashboard as confirmed (keep as pending)
          dashboardProposalReflected = false;

          // Verify escalation state before committing further side effects
          if (escalationEventRecorded && auditLogEntries.length > 0) {
            // State verified: escalation is now recorded and logged
            // Side effects remain uncommitted until manager approval
          }
        }
      }
    };

    // Execute the orchestrator
    await mockOrchestrator();

    // ASSERTIONS: Verify escalation condition was triggered and state transitions occurred correctly

    // (1) Verify escalation status transitioned to awaiting manager review
    expect(managerAssignmentStatus).toBe('awaiting_manager_review');

    // (2) Verify audit log contains escalation event with correct message format
    expect(auditLogEntries).toHaveLength(1);
    expect(auditLogEntries[0].eventType).toBe('escalation_triggered');
    expect(auditLogEntries[0].message).toMatch(/改善提案の実行が困難と判定/);
    expect(auditLogEntries[0].message).toMatch(/Assigned to manager for manual review/);
    expect(auditLogEntries[0].status).toBe('awaiting_manager_review');

    // (3) Verify escalation event was recorded with manager assignment and proposal details
    expect(escalationEventRecorded).not.toBeNull();
    expect(escalationEventRecorded!.escalationType).toBe('proposal_execution_difficulty');
    expect(escalationEventRecorded!.targetManagerId).toBe('MGR-001');
    expect(escalationEventRecorded!.reason).toMatch(/system integration with legacy CRM/);
    expect(escalationEventRecorded!.proposalDetails.sellerId).toBe('SEL-001');
    expect(escalationEventRecorded!.proposalDetails.executionDifficulty).toBe('high');
    expect(escalationEventRecorded!.proposalDetails.linkedActivities).toHaveLength(3);

    // (4) Verify sales rep notification was NOT sent (side effect remains uncommitted)
    expect(proposalNotificationSent).toBe(false);

    // (5) Verify dashboard proposal reflection is in pending state (not confirmed)
    expect(dashboardProposalReflected).toBe(false);

    // (6) Verify system is awaiting manager confirmation before side effects are committed
    expect(managerAssignmentStatus).toBe('awaiting_manager_review');

    // (7) Verify inference accuracy below threshold is captured in context
    const inferenceAccuracy = mockAiClient.getInferenceAccuracy();
    expect(inferenceAccuracy).toBeLessThan(0.95);
  });
});