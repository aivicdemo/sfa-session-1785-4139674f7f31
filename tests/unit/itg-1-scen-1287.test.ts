import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx10Imp1Agent } from '../../src/logic/it-1';

// Mock AI Client interface
interface Tx10Imp1AiClient {
  validateDataQuality: (data: unknown) => Promise<{
    confidenceScore: number;
    qualityScore: number;
    issues: string[];
  }>;
  analyzeProposalContent: (proposal: unknown) => Promise<{
    score?: number;
    judgement: string;
  }>;
  detectPatterns: (input: unknown) => Promise<{
    patterns: Array<{ type: string; risk: string }>;
  }>;
  evaluateRisk: (input: unknown) => Promise<{ evaluation: unknown } | null>;
}

// Mock implementation for low-confidence scenarios
class LowConfidenceMockAiClient implements Tx10Imp1AiClient {
  async validateDataQuality(): Promise<{
    confidenceScore: number;
    qualityScore: number;
    issues: string[];
  }> {
    return {
      confidenceScore: 0.35,
      qualityScore: 70,
      issues: ['missing_contact_date', 'ambiguous_proposal_intent'],
    };
  }

  async analyzeProposalContent(): Promise<{
    score?: number;
    judgement: string;
  }> {
    return {
      judgement: '確実でない可能性がある',
    };
  }

  async detectPatterns(): Promise<{
    patterns: Array<{ type: string; risk: string }>;
  }> {
    return {
      patterns: [
        { type: 'follow_up_delay', risk: 'high' },
        { type: 'follow_up_delay', risk: 'low' },
        { type: 'insufficient_research', risk: 'high' },
      ],
    };
  }

  async evaluateRisk(): Promise<null> {
    return null;
  }
}

describe('営業データ入力から問題検出・通知までの自律実行 - 低確信度出力拒否', () => {
  // SCEN-1287
  test('should escalate and rollback when AI outputs show low confidence, ambiguity, contradictions, and null evaluation', async () => {
    const mockAiClient = new LowConfidenceMockAiClient();

    const salesDataInput = {
      id: 'SALES_INPUT_20240115_001',
      salespersonId: 'SP_2024_0001',
      customerId: 'CUST_2024_00123',
      proposalContent: {
        productId: 'PROD_A001',
        presentedAt: '2024-01-15T10:30:00Z',
        estimatedValue: 250000,
        terms: 'Net 30',
      },
      customerResponse: 'pending',
      nextActionPlanned: 'follow_up_email',
      createdAt: '2024-01-15T11:00:00Z',
    };

    const confidenceThreshold = 0.7;
    const escalationLog: Array<{
      timestamp: string;
      inputDataId: string;
      escalationReason: string;
      aiOutputDetails: Record<string, unknown>;
    }> = [];

    const auditLog: Array<{
      timestamp: string;
      eventType: string;
      details: Record<string, unknown>;
    }> = [];

    // Execute orchestrator with mocked AI client
    const result = await runTx10Imp1Agent(
      salesDataInput,
      mockAiClient,
      confidenceThreshold,
      escalationLog,
      auditLog,
    );

    // Assertion 1: Data quality validation step detects confidence score 0.35 < 0.7 threshold
    expect(result.dataQualityValidationStep).toEqual({
      executed: true,
      confidenceScore: 0.35,
      detected: true,
      reason: 'confidence_below_threshold',
    });

    // Assertion 2: Proposal content analysis step detects ambiguous output (missing score)
    expect(result.proposalAnalysisStep).toEqual({
      executed: true,
      scorePresent: false,
      ambiguityDetected: true,
      reason: 'missing_numeric_score',
    });

    // Assertion 3: Pattern detection step detects contradictory judgments
    expect(result.patternDetectionStep).toEqual({
      executed: true,
      contradictionDetected: true,
      conflictingPatterns: [
        { type: 'follow_up_delay', risk: 'high' },
        { type: 'follow_up_delay', risk: 'low' },
      ],
      reason: 'contradictory_risk_classifications',
    });

    // Assertion 4: Risk evaluation step detects null/invalid evaluation
    expect(result.riskEvaluationStep).toEqual({
      executed: true,
      evaluationResult: null,
      invalidDetected: true,
      reason: 'null_evaluation_result',
    });

    // Assertion 5: Escalation condition triggered
    expect(result.escalationTriggered).toBe(true);

    // Assertion 6: Alert generation skipped
    expect(result.alertGenerated).toBe(false);

    // Assertion 7: Automatic notification not sent
    expect(result.automaticNotificationSent).toBe(false);

    // Assertion 8: Escalation record created in audit log
    expect(auditLog.length).toBeGreaterThan(0);
    const escalationRecord = auditLog.find(
      (log) => log.eventType === 'ESCALATION_RECORDED',
    );
    expect(escalationRecord).toBeDefined();
    expect(escalationRecord?.details).toEqual({
      inputDataId: 'SALES_INPUT_20240115_001',
      escalationReason:
        'AI確信度不足: 信頼度0.35, 曖昧判定検出, 矛盾する複数判定, 無効な評価結果',
      detectedIssues: {
        confidenceScoreBelowThreshold: 0.35,
        ambiguousJudgementDetected: '確実でない可能性がある',
        contradictoryPatterns: [
          { type: 'follow_up_delay', risk: 'high' },
          { type: 'follow_up_delay', risk: 'low' },
        ],
        invalidRiskEvaluation: null,
      },
      timestamp: expect.any(String),
    });

    // Assertion 9: Processing status set to ESCALATED_DUE_TO_LOW_CONFIDENCE
    expect(result.processingStatus).toBe('ESCALATED_DUE_TO_LOW_CONFIDENCE');

    // Assertion 10: System state transitioned to human review pending
    expect(result.systemState).toBe('HUMAN_REVIEW_PENDING');

    // Assertion 11: Sales data NOT reflected in sales system (rollback)
    expect(result.salesSystemReflected).toBe(false);
    expect(result.rollbackExecuted).toBe(true);

    // Assertion 12: Escalation log entry created
    expect(escalationLog.length).toBeGreaterThan(0);
    const currentEscalation = escalationLog[0];
    expect(currentEscalation.inputDataId).toBe('SALES_INPUT_20240115_001');
    expect(currentEscalation.escalationReason).toBe(
      'AI確信度不足: 信頼度0.35, 曖昧判定検出, 矛盾する複数判定, 無効な評価結果',
    );
    expect(currentEscalation.aiOutputDetails).toEqual({
      confidenceScore: 0.35,
      proposalJudgement: '確実でない可能性がある',
      proposalScorePresent: false,
      patternContradictions: 2,
      riskEvaluationResult: null,
    });

    // Assertion 13: Retry with same low-confidence output avoids duplicate escalation
    const retryResult = await runTx10Imp1Agent(
      salesDataInput,
      mockAiClient,
      confidenceThreshold,
      escalationLog,
      auditLog,
    );

    expect(retryResult.duplicateEscalationPrevented).toBe(true);
    expect(retryResult.priorEscalationRecordReferenced).toBe(true);
    expect(escalationLog.length).toBe(1); // No new escalation created
    expect(auditLog.length).toBeGreaterThan(1);
    const duplicatePrevention = auditLog.find(
      (log) => log.eventType === 'DUPLICATE_ESCALATION_PREVENTED',
    );
    expect(duplicatePrevention).toBeDefined();
    expect(duplicatePrevention?.details).toEqual({
      inputDataId: 'SALES_INPUT_20240115_001',
      priorEscalationId: expect.any(String),
      reason: 'same_low_confidence_output_detected',
    });

    // Assertion 14: Escalation accessible in management interface
    expect(result.managementDashboardAccessible).toBe(true);
    expect(result.manualReviewInterface).toEqual({
      enabled: true,
      escalatedDataId: 'SALES_INPUT_20240115_001',
      requiresHumanConfirmation: true,
    });

    // Assertion 15: No alert notification record created
    expect(
      auditLog.filter((log) => log.eventType === 'ALERT_GENERATED'),
    ).toHaveLength(0);
    expect(
      auditLog.filter((log) => log.eventType === 'NOTIFICATION_SENT'),
    ).toHaveLength(0);
  });
});