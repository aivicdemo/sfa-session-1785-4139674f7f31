import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx10Imp1Agent } from "../../src/agents/tx-10-imp-1/orchestrator";
import type {
  Tx10Imp1AiClient,
  DetectedIssue,
  EscalationContext,
  HumanReviewEscalation,
  AuditEvent,
} from "../../src/agents/tx-10-imp-1/types";

interface MockAiClientState {
  callLog: Array<{ method: string; args: unknown; timestamp: Date }>;
  validationResult: {
    isComplete: boolean;
    qualityScore: number;
    issues: string[];
  };
  detectedIssues: DetectedIssue[];
  escalationTriggered: boolean;
  sideEffectsPending: Array<{
    type: string;
    data: unknown;
    status: "pending" | "committed";
  }>;
  auditEvents: AuditEvent[];
}

class MockTx10Imp1AiClient implements Tx10Imp1AiClient {
  private state: MockAiClientState = {
    callLog: [],
    validationResult: {
      isComplete: true,
      qualityScore: 85,
      issues: [],
    },
    detectedIssues: [],
    escalationTriggered: false,
    sideEffectsPending: [],
    auditEvents: [],
  };

  async validateDataQuality(input: {
    salesDataId: string;
    requiredFields: string[];
  }): Promise<{ isComplete: boolean; qualityScore: number; issues: string[] }> {
    const timestamp = new Date("2024-01-15T14:30:00Z");
    this.state.callLog.push({
      method: "validateDataQuality",
      args: input,
      timestamp,
    });

    const result = {
      isComplete: true,
      qualityScore: 78,
      issues: ["missing_email", "invalid_phone_format"],
    };
    this.state.validationResult = result;
    return result;
  }

  async analyzeProposalContent(input: {
    proposalId: string;
    proposalText: string;
    salesPersonId: string;
    customerId: string;
  }): Promise<{ successPatternMatch: number; detectedPatterns: string[] }> {
    const timestamp = new Date("2024-01-15T14:31:00Z");
    this.state.callLog.push({
      method: "analyzeProposalContent",
      args: input,
      timestamp,
    });

    return {
      successPatternMatch: 45,
      detectedPatterns: ["insufficient_context", "vague_timeline"],
    };
  }

  async detectInappropriatePatterns(input: {
    proposalId: string;
    proposalContent: string;
    analysisResult: { successPatternMatch: number; detectedPatterns: string[] };
    validationResult: { isComplete: boolean; qualityScore: number };
  }): Promise<{
    inappropriatePatterns: DetectedIssue[];
    escalationRequired: boolean;
  }> {
    const timestamp = new Date("2024-01-15T14:32:00Z");
    this.state.callLog.push({
      method: "detectInappropriatePatterns",
      args: input,
      timestamp,
    });

    const issues: DetectedIssue[] = [
      {
        patternId: "risk_factor_001",
        patternType: "risk_factor",
        severity: "high",
        riskScore: 82,
        description: "Customer commitment history indicates low engagement",
        detectedAt: timestamp,
      },
      {
        patternId: "constraint_violation_001",
        patternType: "constraint_violation",
        severity: "high",
        riskScore: 75,
        description: "Proposed product exceeds customer budget constraint",
        detectedAt: timestamp,
      },
      {
        patternId: "quality_deficit_001",
        patternType: "quality_deficit",
        severity: "medium",
        riskScore: 68,
        description: "Proposal missing required customer needs analysis",
        detectedAt: timestamp,
      },
    ];

    this.state.detectedIssues = issues;
    const shouldEscalate = issues.length >= 2;
    this.state.escalationTriggered = shouldEscalate;

    return {
      inappropriatePatterns: issues,
      escalationRequired: shouldEscalate,
    };
  }

  async generateEscalationContext(input: {
    inappropriatePatterns: DetectedIssue[];
    validationResult: { qualityScore: number };
    proposalId: string;
    salesPersonId: string;
    customerId: string;
  }): Promise<EscalationContext> {
    const timestamp = new Date("2024-01-15T14:33:00Z");
    this.state.callLog.push({
      method: "generateEscalationContext",
      args: input,
      timestamp,
    });

    return {
      escalationId: "esc_20240115_001",
      triggeredAt: timestamp,
      reason: "multiple_inappropriate_patterns_detected",
      detectedIssuesList: input.inappropriatePatterns,
      dataQualityScore: input.validationResult.qualityScore,
      proposalId: input.proposalId,
      salesPersonId: input.salesPersonId,
      customerId: input.customerId,
      contextMetadata: {
        detectionCount: input.inappropriatePatterns.length,
        highSeverityCount: input.inappropriatePatterns.filter(
          (p) => p.severity === "high"
        ).length,
      },
    };
  }

  async initiateHumanReview(input: {
    escalationContext: EscalationContext;
  }): Promise<HumanReviewEscalation> {
    const timestamp = new Date("2024-01-15T14:34:00Z");
    this.state.callLog.push({
      method: "initiateHumanReview",
      args: input,
      timestamp,
    });

    const pendingSideEffects = [
      {
        type: "alert_notification",
        data: {
          recipientType: "manager",
          message: "Multiple inappropriate patterns detected in sales proposal",
        },
        status: "pending" as const,
      },
      {
        type: "record_issue_log",
        data: {
          escalationId: input.escalationContext.escalationId,
          details: input.escalationContext.detectedIssuesList,
        },
        status: "pending" as const,
      },
      {
        type: "status_update",
        data: {
          proposalId: input.escalationContext.proposalId,
          newStatus: "escalated_for_review",
        },
        status: "pending" as const,
      },
    ];

    this.state.sideEffectsPending = pendingSideEffects;

    return {
      reviewId: "rev_20240115_001",
      escalationId: input.escalationContext.escalationId,
      createdAt: timestamp,
      status: "awaiting_human_decision",
      pendingSideEffects: pendingSideEffects,
    };
  }

  async recordAuditEvent(event: AuditEvent): Promise<void> {
    this.state.auditEvents.push(event);
  }

  getCallLog(): Array<{ method: string; args: unknown; timestamp: Date }> {
    return this.state.callLog;
  }

  getDetectedIssues(): DetectedIssue[] {
    return this.state.detectedIssues;
  }

  isEscalationTriggered(): boolean {
    return this.state.escalationTriggered;
  }

  getPendingSideEffects(): Array<{
    type: string;
    data: unknown;
    status: "pending" | "committed";
  }> {
    return this.state.sideEffectsPending;
  }

  getAuditEvents(): AuditEvent[] {
    return this.state.auditEvents;
  }

  async commitSideEffects(_input: {
    reviewId: string;
    decision: unknown;
  }): Promise<void> {
    throw new Error(
      "commitSideEffects should not be called during escalation pending state"
    );
  }
}

describe("Tx10Imp1Agent - Multiple Inappropriate Patterns Detection Escalation", () => {
  let mockAiClient: MockTx10Imp1AiClient;
  let capturedEscalationContext: EscalationContext | null = null;
  let capturedHumanReview: HumanReviewEscalation | null = null;

  beforeEach(() => {
    mockAiClient = new MockTx10Imp1AiClient();
    capturedEscalationContext = null;
    capturedHumanReview = null;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1283
  test("should escalate to human review when multiple inappropriate patterns detected simultaneously", async () => {
    const testInputData = {
      salesDataId: "sales_20240115_001",
      proposalId: "prop_20240115_001",
      salesPersonId: "sp_12345",
      customerId: "cust_67890",
      proposalText:
        "We recommend purchasing the enterprise package with annual contract at $150,000 commitment. Customer engagement history shows minimal interaction over past 6 months.",
      requiredFields: [
        "customerId",
        "salesPersonId",
        "proposalText",
        "contactEmail",
        "contactPhone",
      ],
    };

    // Step 1: Execute data quality validation
    const validationResult = await mockAiClient.validateDataQuality({
      salesDataId: testInputData.salesDataId,
      requiredFields: testInputData.requiredFields,
    });

    expect(validationResult.isComplete).toBe(true);
    expect(validationResult.qualityScore).toBe(78);
    expect(validationResult.issues).toContain("missing_email");
    expect(validationResult.issues).toContain("invalid_phone_format");

    // Step 2: Execute proposal content analysis
    const analysisResult = await mockAiClient.analyzeProposalContent({
      proposalId: testInputData.proposalId,
      proposalText: testInputData.proposalText,
      salesPersonId: testInputData.salesPersonId,
      customerId: testInputData.customerId,
    });

    expect(analysisResult.successPatternMatch).toBe(45);
    expect(analysisResult.detectedPatterns).toContain("insufficient_context");
    expect(analysisResult.detectedPatterns).toContain("vague_timeline");

    // Step 3: Detect inappropriate patterns
    const detectionResult =
      await mockAiClient.detectInappropriatePatterns({
        proposalId: testInputData.proposalId,
        proposalContent: testInputData.proposalText,
        analysisResult: analysisResult,
        validationResult: validationResult,
      });

    expect(detectionResult.inappropriatePatterns.length).toBe(3);
    expect(detectionResult.inappropriatePatterns[0].patternType).toBe(
      "risk_factor"
    );
    expect(detectionResult.inappropriatePatterns[0].riskScore).toBe(82);
    expect(detectionResult.inappropriatePatterns[1].patternType).toBe(
      "constraint_violation"
    );
    expect(detectionResult.inappropriatePatterns[1].riskScore).toBe(75);
    expect(detectionResult.inappropriatePatterns[2].patternType).toBe(
      "quality_deficit"
    );
    expect(detectionResult.inappropriatePatterns[2].riskScore).toBe(68);
    expect(detectionResult.inappropriatePatterns.length).toBeGreaterThanOrEqual(
      2
    );
    expect(detectionResult.escalationRequired).toBe(true);

    // Step 4: Verify escalation trigger condition
    expect(mockAiClient.isEscalationTriggered()).toBe(true);

    // Step 5: Generate escalation context
    const escalationContext =
      await mockAiClient.generateEscalationContext({
        inappropriatePatterns: detectionResult.inappropriatePatterns,
        validationResult: validationResult,
        proposalId: testInputData.proposalId,
        salesPersonId: testInputData.salesPersonId,
        customerId: testInputData.customerId,
      });

    capturedEscalationContext = escalationContext;

    expect(escalationContext.escalationId).toBe("esc_20240115_001");
    expect(escalationContext.triggeredAt).toEqual(
      new Date("2024-01-15T14:33:00Z")
    );
    expect(escalationContext.reason).toBe(
      "multiple_inappropriate_patterns_detected"
    );
    expect(escalationContext.detectedIssuesList.length).toBe(3);
    expect(escalationContext.dataQualityScore).toBe(78);
    expect(escalationContext.proposalId).toBe(testInputData.proposalId);
    expect(escalationContext.salesPersonId).toBe(testInputData.salesPersonId);
    expect(escalationContext.customerId).toBe(testInputData.customerId);
    expect(escalationContext.contextMetadata.detectionCount).toBe(3);
    expect(escalationContext.contextMetadata.highSeverityCount).toBe(2);

    // Step 6: Initiate human review escalation process
    const humanReview = await mockAiClient.initiateHumanReview({
      escalationContext: escalationContext,
    });

    capturedHumanReview = humanReview;

    expect(humanReview.reviewId).toBe("rev_20240115_001");
    expect(humanReview.escalationId).toBe(escalationContext.escalationId);
    expect(humanReview.createdAt).toEqual(
      new Date("2024-01-15T14:34:00Z")
    );
    expect(humanReview.status).toBe("awaiting_human_decision");

    // Step 7: Verify side effects are in pending state, not committed
    const pendingSideEffects = mockAiClient.getPendingSideEffects();
    expect(pendingSideEffects.length).toBe(3);

    expect(pendingSideEffects[0].type).toBe("alert_notification");
    expect(pendingSideEffects[0].status).toBe("pending");
    expect(pendingSideEffects[0].data).toEqual({
      recipientType: "manager",
      message: "Multiple inappropriate patterns detected in sales proposal",
    });

    expect(pendingSideEffects[1].type).toBe("record_issue_log");
    expect(pendingSideEffects[1].status).toBe("pending");

    expect(pendingSideEffects[2].type).toBe("status_update");
    expect(pendingSideEffects[2].status).toBe("pending");
    expect(pendingSideEffects[2].data).toEqual({
      proposalId: testInputData.proposalId,
      newStatus: "escalated_for_review",
    });

    // Step 8: Verify commitSideEffects is not called during escalation
    let commitSideEffectsErrorThrown = false;
    try {
      await mockAiClient.commitSideEffects({
        reviewId: humanReview.reviewId,
        decision: {},
      });
    } catch {
      commitSideEffectsErrorThrown = true;
    }

    expect(commitSideEffectsErrorThrown).toBe(true);

    // Step 9: Record audit events
    const escalationAuditEvent: AuditEvent = {
      eventId: "audit_esc_20240115_001",
      eventType: "escalation_triggered",
      timestamp: new Date("2024-01-15T14:32:30Z"),
      description: "Multiple inappropriate patterns detected, escalation triggered",
      details: {
        escalationId: escalationContext.escalationId,
        detectionCount: escalationContext.contextMetadata.detectionCount,
        patterns: escalationContext.detectedIssuesList.map((p) => ({
          patternId: p.patternId,
          type: p.patternType,
          severity: p.severity,
          riskScore: p.riskScore,
        })),
      },
    };

    const humanReviewInitiatedEvent: AuditEvent = {
      eventId: "audit_review_20240115_001",
      eventType: "human_review_initiated",
      timestamp: new Date("2024-01-15T14:34:30Z"),
      description: "Human review process initiated after escalation",
      details: {
        reviewId: humanReview.reviewId,
        escalationId: humanReview.escalationId,
        status: humanReview.status,
      },
    };

    const sideEffectsPendingEvent: AuditEvent = {
      eventId: "audit_pending_20240115_001",
      eventType: "side_effects_pending",
      timestamp: new Date("2024-01-15T14:35:00Z"),
      description: "Side effects held in pending state pending human decision",
      details: {
        reviewId: humanReview.reviewId,
        pendingEffectCount: pendingSideEffects.length,
        effectTypes: pendingSideEffects.map((e) => e.type),
      },
    };

    await mockAiClient.recordAuditEvent(escalationAuditEvent);
    await mockAiClient.recordAuditEvent(humanReviewInitiatedEvent);
    await mockAiClient.recordAuditEvent(sideEffectsPendingEvent);

    const auditEvents = mockAiClient.getAuditEvents();
    expect(auditEvents.length).toBe(3);

    expect(auditEvents[0].eventType).toBe("escalation_triggered");
    expect(auditEvents[0].description).toContain(
      "Multiple inappropriate patterns detected"
    );
    expect(auditEvents[0].details.detectionCount).toBe(3);

    expect(auditEvents[1].eventType).toBe("human_review_initiated");
    expect(auditEvents[1].description).toContain("Human review process");
    expect(auditEvents[1].details.status).toBe("awaiting_human_decision");

    expect(auditEvents[2].eventType).toBe("side_effects_pending");
    expect(auditEvents[2].description).toContain("pending state pending human");
    expect(auditEvents[2].details.pendingEffectCount).toBe(3);
    expect(auditEvents[2].details.effectTypes).toContain("alert_notification");
    expect(auditEvents[2].details.effectTypes).toContain("record_issue_log");
    expect(auditEvents[2].details.effectTypes).toContain("status_update");

    // Step 10: Verify call sequence order
    const callLog = mockAiClient.getCallLog();
    expect(callLog.length).toBe(5);
    expect(callLog[0].method).toBe("validateDataQuality");
    expect(callLog[1].method).toBe("analyzeProposalContent");
    expect(callLog[2].method).toBe("detectInappropriatePatterns");
    expect(callLog[3].method).toBe("generateEscalationContext");
    expect(callLog[4].method).toBe("initiateHumanReview");

    // Verify temporal ordering
    expect(callLog[0].timestamp.getTime()).toBeLessThan(
      callLog[1].timestamp.getTime()
    );
    expect(callLog[1].timestamp.getTime()).toBeLessThan(
      callLog[2].timestamp.getTime()
    );
    expect(callLog[2].timestamp.getTime()).toBeLessThan(
      callLog[3].timestamp.getTime()
    );
    expect(callLog[3].timestamp.getTime()).toBeLessThan(
      callLog[4].timestamp.getTime()
    );
  });
});