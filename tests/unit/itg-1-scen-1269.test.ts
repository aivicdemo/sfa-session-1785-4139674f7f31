import { runTx3Imp1Agent, Tx3Imp1AiClient, Tx3Imp1Input, Tx3Imp1Output, EscalationNotification, AuditEvent } from '../../src/logic/it-1';

const createMockAiClient = (): Tx3Imp1AiClient => ({
  diagnoseHealthCheck: jest.fn(),
  analyzeDataQuality: jest.fn(),
  evaluateInferencePrecision: jest.fn(),
});

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-1269: [error] ヘルスチェック・データ品質・推論精度の統合診断と異常集約の自律実行 AIエージェント - 不正・曖昧・低確信度のAI出力を拒否して安全に引き継ぐ
  test("should reject malformed, ambiguous, and low-confidence AI outputs and escalate to human review", async () => {
    const mockAiClient = createMockAiClient();
    const auditLog: AuditEvent[] = [];

    const testInput: Tx3Imp1Input = {
      triggerId: "scheduled_weekly_health_check_001",
      triggerType: "periodic",
      triggeredAt: new Date("2024-01-15T09:00:00Z"),
      targetSystemIds: ["sales_system", "data_quality_system", "ai_inference_system"],
    };

    // Pattern 1: JSON Schema Violation (missing required field 'diagnosis_summary')
    const malformedOutput = {
      timestamp: "2024-01-15T09:00:00Z",
      health_status: "degraded",
      // diagnosis_summary is intentionally missing
      system_checks: [
        { system_id: "sales_system", status: "ok", confidence: 0.95 },
      ],
    };

    // Pattern 2: Logical Inconsistency (contradictory diagnosis results)
    const logicallyInconsistentOutput = {
      timestamp: "2024-01-15T09:05:00Z",
      diagnosis_summary: "System operating normally",
      health_status: "critical",
      data_quality_analysis: {
        overall_score: 95,
        status: "excellent",
      },
      inference_precision_evaluation: {
        overall_score: 25,
        status: "critical",
        confidence: 0.92,
      },
      system_checks: [
        { system_id: "sales_system", status: "ok", confidence: 0.95 },
        { system_id: "sales_system", status: "down", confidence: 0.95 },
      ],
    };

    // Pattern 3: Low Confidence Score (0.25 < 0.7 threshold)
    const lowConfidenceOutput = {
      timestamp: "2024-01-15T09:10:00Z",
      diagnosis_summary: "Unable to reliably determine system status",
      health_status: "unknown",
      data_quality_analysis: {
        overall_score: 78,
        status: "acceptable",
        confidence: 0.25,
      },
      inference_precision_evaluation: {
        overall_score: 62,
        status: "degraded",
        confidence: 0.25,
      },
      system_checks: [
        { system_id: "sales_system", status: "unknown", confidence: 0.25 },
      ],
    };

    let rejectionCount = 0;
    let executionResults: Tx3Imp1Output[] = [];

    // Test Pattern 1: JSON Schema Violation
    (mockAiClient.diagnoseHealthCheck as jest.Mock).mockResolvedValueOnce(
      malformedOutput
    );
    (mockAiClient.analyzeDataQuality as jest.Mock).mockResolvedValueOnce({
      timestamp: "2024-01-15T09:00:00Z",
      overall_score: 92,
      status: "good",
      confidence: 0.88,
    });
    (mockAiClient.evaluateInferencePrecision as jest.Mock).mockResolvedValueOnce(
      {
        timestamp: "2024-01-15T09:00:00Z",
        overall_score: 88,
        status: "good",
        confidence: 0.91,
      }
    );

    const result1 = await runTx3Imp1Agent(testInput, mockAiClient, auditLog);
    executionResults.push(result1);

    expect(result1.status).toBe("PENDING_HUMAN_REVIEW");
    expect(result1.escalation).toBeDefined();
    expect(result1.escalation?.rejectionType).toBe("validation_failure");
    expect(result1.escalation?.rejectionDetails).toMatch(/diagnosis_summary/);
    expect(result1.escalation?.aiOutputSummary).toBeDefined();
    expect(result1.escalation?.timestamp).toBe("2024-01-15T09:00:00Z");
    expect(result1.escalation?.requiresHumanReview).toBe(true);
    rejectionCount++;

    // Verify audit log contains validation failure event
    const validationFailureEvent = auditLog.find(
      (evt) => evt.type === "ai_output_rejection" && evt.rejectionReason === "validation_failure"
    );
    expect(validationFailureEvent).toBeDefined();
    expect(validationFailureEvent?.timestamp).toBe("2024-01-15T09:00:00Z");
    expect(validationFailureEvent?.aiOutputSummary).toMatch(/diagnosis_summary/);

    // Test Pattern 2: Logical Inconsistency
    (mockAiClient.diagnoseHealthCheck as jest.Mock).mockResolvedValueOnce(
      logicallyInconsistentOutput
    );
    (mockAiClient.analyzeDataQuality as jest.Mock).mockResolvedValueOnce({
      timestamp: "2024-01-15T09:05:00Z",
      overall_score: 95,
      status: "excellent",
      confidence: 0.92,
    });
    (mockAiClient.evaluateInferencePrecision as jest.Mock).mockResolvedValueOnce(
      {
        timestamp: "2024-01-15T09:05:00Z",
        overall_score: 25,
        status: "critical",
        confidence: 0.92,
      }
    );

    const result2 = await runTx3Imp1Agent(testInput, mockAiClient, auditLog);
    executionResults.push(result2);

    expect(result2.status).toBe("PENDING_HUMAN_REVIEW");
    expect(result2.escalation).toBeDefined();
    expect(result2.escalation?.rejectionType).toBe("logical_inconsistency");
    expect(result2.escalation?.rejectionDetails).toMatch(/矛盾|contradiction|inconsistency/i);
    expect(result2.escalation?.timestamp).toBe("2024-01-15T09:05:00Z");
    expect(result2.escalation?.requiresHumanReview).toBe(true);
    rejectionCount++;

    // Verify audit log contains logical inconsistency event
    const logicalInconsistencyEvent = auditLog.find(
      (evt) => evt.type === "ai_output_rejection" && evt.rejectionReason === "logical_inconsistency"
    );
    expect(logicalInconsistencyEvent).toBeDefined();
    expect(logicalInconsistencyEvent?.timestamp).toBe("2024-01-15T09:05:00Z");

    // Test Pattern 3: Low Confidence Score
    (mockAiClient.diagnoseHealthCheck as jest.Mock).mockResolvedValueOnce(
      lowConfidenceOutput
    );
    (mockAiClient.analyzeDataQuality as jest.Mock).mockResolvedValueOnce({
      timestamp: "2024-01-15T09:10:00Z",
      overall_score: 78,
      status: "acceptable",
      confidence: 0.25,
    });
    (mockAiClient.evaluateInferencePrecision as jest.Mock).mockResolvedValueOnce(
      {
        timestamp: "2024-01-15T09:10:00Z",
        overall_score: 62,
        status: "degraded",
        confidence: 0.25,
      }
    );

    const result3 = await runTx3Imp1Agent(testInput, mockAiClient, auditLog);
    executionResults.push(result3);

    expect(result3.status).toBe("PENDING_HUMAN_REVIEW");
    expect(result3.escalation).toBeDefined();
    expect(result3.escalation?.rejectionType).toBe("low_confidence");
    expect(result3.escalation?.rejectionDetails).toMatch(/0\.25.*0\.7|threshold/i);
    expect(result3.escalation?.timestamp).toBe("2024-01-15T09:10:00Z");
    expect(result3.escalation?.requiresHumanReview).toBe(true);
    rejectionCount++;

    // Verify audit log contains low confidence event
    const lowConfidenceEvent = auditLog.find(
      (evt) => evt.type === "ai_output_rejection" && evt.rejectionReason === "low_confidence"
    );
    expect(lowConfidenceEvent).toBeDefined();
    expect(lowConfidenceEvent?.timestamp).toBe("2024-01-15T09:10:00Z");
    expect(lowConfidenceEvent?.aiOutputSummary).toMatch(/confidence/i);

    // Verify all 3 rejection patterns were captured
    expect(rejectionCount).toBe(3);

    // Verify audit log has exactly 3 ai_output_rejection events
    const rejectionEvents = auditLog.filter((evt) => evt.type === "ai_output_rejection");
    expect(rejectionEvents.length).toBe(3);

    // Verify all rejection events have required fields
    rejectionEvents.forEach((evt) => {
      expect(evt.rejectionReason).toMatch(
        /validation_failure|logical_inconsistency|low_confidence/
      );
      expect(evt.timestamp).toBeDefined();
      expect(evt.aiOutputSummary).toBeDefined();
    });

    // Verify escalation information is complete for all results
    executionResults.forEach((result) => {
      expect(result.escalation).toBeDefined();
      expect(result.escalation?.rejectionType).toBeDefined();
      expect(result.escalation?.rejectionDetails).toBeDefined();
      expect(result.escalation?.aiOutputSummary).toBeDefined();
      expect(result.escalation?.recommendedAction).toBeDefined();
      expect(result.escalation?.timestamp).toBeDefined();
      expect(result.escalation?.handoffUserIds).toBeDefined();
      expect(Array.isArray(result.escalation?.handoffUserIds)).toBe(true);
    });

    // Verify no automatic processing occurred after rejections
    expect(result1.diagnosticResults).toBeUndefined();
    expect(result2.diagnosticResults).toBeUndefined();
    expect(result3.diagnosticResults).toBeUndefined();

    // Verify status is consistently PENDING_HUMAN_REVIEW across all rejections
    expect(
      executionResults.every((r) => r.status === "PENDING_HUMAN_REVIEW")
    ).toBe(true);
  });
});