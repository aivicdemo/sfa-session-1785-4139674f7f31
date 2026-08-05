import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx2Imp2Agent } from "../../src/agents/tx-2-imp-2/orchestrator";

// Mock AI Client
class MockTx2Imp2AiClient {
  private callCount: number = 0;
  private inferenceAccuracy: number = 0.95;

  setInferenceAccuracy(accuracy: number): void {
    this.inferenceAccuracy = accuracy;
  }

  getCallCount(): number {
    return this.callCount;
  }

  async analyzeProcessCompliance(input: {
    employeeId: string;
    activityData: Record<string, unknown>;
  }): Promise<{
    complianceRate: number;
    improvementOpportunities: Array<{
      opportunity: string;
      severity: string;
    }>;
    confidence: number;
  }> {
    this.callCount += 1;
    return {
      complianceRate: 72,
      improvementOpportunities: [
        {
          opportunity: "顧客接触頻度の低さ",
          severity: "high",
        },
      ],
      confidence: this.inferenceAccuracy,
    };
  }

  async generateImprovement(input: {
    employeeId: string;
    opportunity: string;
    successPatterns: Record<string, unknown>;
  }): Promise<{
    proposalId: string;
    proposalContent: string;
    recommendedActions: string[];
    status: string;
  }> {
    this.callCount += 1;
    return {
      proposalId: "PROP-20250101-001",
      proposalContent: "顧客接触頻度を週1回以上に増加させることを推奨",
      recommendedActions: [
        "顧客リストの再評価",
        "訪問スケジュールの最適化",
      ],
      status: "承認待ち",
    };
  }

  resetCallCount(): void {
    this.callCount = 0;
  }
}

// Mock Database
class MockDatabaseClient {
  private improvementProposals: Array<{
    proposalId: string;
    employeeId: string;
    opportunity: string;
    createdAt: string;
    status: string;
    requestId: string;
  }> = [];

  private notificationLogs: Array<{
    proposalId: string;
    recipientType: string;
    createdAt: string;
    requestId: string;
  }> = [];

  private auditLogs: Array<{
    requestId: string;
    status: string;
    createdAt: string;
  }> = [];

  async saveImprovement(proposal: {
    proposalId: string;
    employeeId: string;
    opportunity: string;
    createdAt: string;
    status: string;
    requestId: string;
  }): Promise<void> {
    this.improvementProposals.push(proposal);
  }

  async saveNotification(notification: {
    proposalId: string;
    recipientType: string;
    createdAt: string;
    requestId: string;
  }): Promise<void> {
    this.notificationLogs.push(notification);
  }

  async saveAudit(audit: {
    requestId: string;
    status: string;
    createdAt: string;
  }): Promise<void> {
    this.auditLogs.push(audit);
  }

  getImprovementProposalsCount(
    employeeId: string,
    opportunity: string
  ): number {
    return this.improvementProposals.filter(
      (p) => p.employeeId === employeeId && p.opportunity === opportunity
    ).length;
  }

  getEmployeeNotificationsCount(proposalId: string): number {
    return this.notificationLogs.filter(
      (n) => n.proposalId === proposalId && n.recipientType === "employee"
    ).length;
  }

  getManagerNotificationsCount(proposalId: string): number {
    return this.notificationLogs.filter(
      (n) => n.proposalId === proposalId && n.recipientType === "manager"
    ).length;
  }

  getAllNotificationsForProposal(proposalId: string): Array<{
    proposalId: string;
    recipientType: string;
    createdAt: string;
    requestId: string;
  }> {
    return this.notificationLogs.filter((n) => n.proposalId === proposalId);
  }

  getAuditLogsCount(): number {
    return this.auditLogs.length;
  }

  getAuditLogsByRequestId(requestId: string): Array<{
    requestId: string;
    status: string;
    createdAt: string;
  }> {
    return this.auditLogs.filter((a) => a.requestId === requestId);
  }

  getAllProposals(): Array<{
    proposalId: string;
    employeeId: string;
    opportunity: string;
    createdAt: string;
    status: string;
    requestId: string;
  }> {
    return this.improvementProposals;
  }

  resetDatabase(): void {
    this.improvementProposals = [];
    this.notificationLogs = [];
    this.auditLogs = [];
  }
}

describe("営業プロセス遵守状況の自動監視と改善提案の実行 - アイデンポテント実行", () => {
  let mockAiClient: MockTx2Imp2AiClient;
  let mockDb: MockDatabaseClient;

  beforeEach(() => {
    mockAiClient = new MockTx2Imp2AiClient();
    mockDb = new MockDatabaseClient();
    mockAiClient.setInferenceAccuracy(0.95);
  });

  afterEach(() => {
    mockDb.resetDatabase();
    mockAiClient.resetCallCount();
  });

  // SCEN-1253
  test("営業プロセス遵守状況の自動監視と改善提案の実行 AIエージェント - 同じ要求を再実行しても重複しない", async () => {
    const employeeId = "EMP-001";
    const activityData = {
      complianceRate: 72,
      contactFrequency: "月1回程度",
      proposalContent: "標準プロセスに準じた提案",
    };

    const requestId1 = "REQ-20250101-001";
    const firstExecutionTimestamp = "2025-01-01T10:00:00Z";

    // First execution
    const firstResult = await runTx2Imp2Agent({
      aiClient: mockAiClient as any,
      dbClient: mockDb as any,
      employeeId,
      activityData,
      requestId: requestId1,
      executionTimestamp: firstExecutionTimestamp,
    });

    // Verify first execution results
    expect(firstResult.status).toBe("completed");
    expect(firstResult.proposalGenerated).toBe(true);
    expect(firstResult.proposalId).toBe("PROP-20250101-001");

    // Check database state after first execution
    const firstProposalsCount = mockDb.getImprovementProposalsCount(
      employeeId,
      "顧客接触頻度の低さ"
    );
    expect(firstProposalsCount).toBe(1);

    const firstEmployeeNotifications = mockDb.getEmployeeNotificationsCount(
      "PROP-20250101-001"
    );
    expect(firstEmployeeNotifications).toBe(1);

    const firstManagerNotifications = mockDb.getManagerNotificationsCount(
      "PROP-20250101-001"
    );
    expect(firstManagerNotifications).toBe(1);

    const firstAiCallCount = mockAiClient.getCallCount();
    expect(firstAiCallCount).toBe(2); // analyzeProcessCompliance + generateImprovement

    // Store first audit logs
    const firstAuditLogs = mockDb.getAuditLogsByRequestId(requestId1);
    expect(firstAuditLogs.length).toBeGreaterThan(0);
    expect(firstAuditLogs[0].status).toBe("completed");

    // Reset call count for second execution tracking
    mockAiClient.resetCallCount();

    // Second execution with same data
    const requestId2 = "REQ-20250101-002";
    const secondExecutionTimestamp = "2025-01-01T11:00:00Z";

    const secondResult = await runTx2Imp2Agent({
      aiClient: mockAiClient as any,
      dbClient: mockDb as any,
      employeeId,
      activityData,
      requestId: requestId2,
      executionTimestamp: secondExecutionTimestamp,
    });

    // Verify second execution detects idempotency
    expect(secondResult.status).toBe("skipped");
    expect(secondResult.reason).toBe("重複実行（スキップ）");

    // Verify no new proposals were created
    const secondProposalsCount = mockDb.getImprovementProposalsCount(
      employeeId,
      "顧客接触頻度の低さ"
    );
    expect(secondProposalsCount).toBe(1); // Still 1, not 2

    // Verify no duplicate notifications were sent
    const secondEmployeeNotifications = mockDb.getEmployeeNotificationsCount(
      "PROP-20250101-001"
    );
    expect(secondEmployeeNotifications).toBe(1); // Still 1, not 2

    const secondManagerNotifications = mockDb.getManagerNotificationsCount(
      "PROP-20250101-001"
    );
    expect(secondManagerNotifications).toBe(1); // Still 1, not 2

    // Verify AI was called 0 times on second execution (idempotent)
    const secondAiCallCount = mockAiClient.getCallCount();
    expect(secondAiCallCount).toBe(0);

    // Verify audit logs show different request IDs
    const secondAuditLogs = mockDb.getAuditLogsByRequestId(requestId2);
    expect(secondAuditLogs.length).toBeGreaterThan(0);
    expect(secondAuditLogs[0].status).toBe("重複実行（スキップ）");

    // Verify request IDs are different
    expect(firstAuditLogs[0]).not.toEqual(secondAuditLogs[0]);

    // Verify all proposals in database
    const allProposals = mockDb.getAllProposals();
    expect(allProposals.length).toBe(1); // Only one unique proposal

    // Verify proposal details
    expect(allProposals[0].proposalId).toBe("PROP-20250101-001");
    expect(allProposals[0].employeeId).toBe("EMP-001");
    expect(allProposals[0].opportunity).toBe("顧客接触頻度の低さ");
    expect(allProposals[0].status).toBe("承認待ち");

    // Verify notifications for the single proposal
    const allNotifications = mockDb.getAllNotificationsForProposal(
      "PROP-20250101-001"
    );
    expect(allNotifications.length).toBe(2); // One for employee, one for manager

    const employeeNotif = allNotifications.find(
      (n) => n.recipientType === "employee"
    );
    expect(employeeNotif).toBeDefined();

    const managerNotif = allNotifications.find(
      (n) => n.recipientType === "manager"
    );
    expect(managerNotif).toBeDefined();
  });
});