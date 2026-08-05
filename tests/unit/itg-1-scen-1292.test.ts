import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx10Imp1Agent } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-1292
  it("should rollback all side effects when alert notification fails during autonomous execution", async () => {
    const mockAiClient = {
      validateDataQuality: jest.fn(),
      analyzeProposalContent: jest.fn(),
      detectInappropriatePattern: jest.fn(),
      sendAlertNotification: jest.fn(),
    };

    const mockDatabase = {
      beginTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      insertDataQualityValidation: jest.fn(),
      insertProposalAnalysisScore: jest.fn(),
      insertInappropriatePatternResult: jest.fn(),
      deleteDataQualityValidation: jest.fn(),
      deleteProposalAnalysisScore: jest.fn(),
      deleteInappropriatePatternResult: jest.fn(),
      markAsCompensated: jest.fn(),
      queryAuditLog: jest.fn(),
      insertAuditLog: jest.fn(),
    };

    const mockCache = {
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
    };

    const mockNotificationService = {
      sendToAdmin: jest.fn(),
    };

    const inputSalesData = {
      salesDataId: "sd-20240115-001",
      customerId: "cust-5001",
      customerName: "ABC Corporation",
      proposalContent: "Enterprise Cloud Solution Package",
      proposalAmount: 500000,
      proposalDate: "2024-01-15T10:30:00Z",
      followUpSchedule: "2024-01-20T14:00:00Z",
      salesPersonId: "sp-2001",
      status: "input_received",
    };

    const dataQualityValidationResult = {
      validationId: "dqv-20240115-001",
      salesDataId: "sd-20240115-001",
      qualityScore: 92,
      completenessCheck: true,
      formatValidation: true,
      duplicateDetection: false,
      timestamp: "2024-01-15T10:31:00Z",
      status: "valid",
    };

    const proposalAnalysisScoreResult = {
      analysisId: "pas-20240115-001",
      salesDataId: "sd-20240115-001",
      successPatternMatchScore: 78,
      suitabilityScore: 85,
      riskFactors: [],
      timestamp: "2024-01-15T10:32:00Z",
      status: "analyzed",
    };

    const inappropriatePatternResult = {
      patternId: "ipp-20240115-001",
      salesDataId: "sd-20240115-001",
      detectionStatus: "no_issues_detected",
      riskLevel: "low",
      timestamp: "2024-01-15T10:33:00Z",
      status: "completed",
    };

    // Setup mock behaviors: data validation succeeds
    mockAiClient.validateDataQuality.mockResolvedValue(
      dataQualityValidationResult
    );

    // Setup mock behaviors: proposal analysis succeeds
    mockAiClient.analyzeProposalContent.mockResolvedValue(
      proposalAnalysisScoreResult
    );

    // Setup mock behaviors: pattern detection succeeds
    mockAiClient.detectInappropriatePattern.mockResolvedValue(
      inappropriatePatternResult
    );

    // Setup mock behaviors: alert notification FAILS
    mockAiClient.sendAlertNotification.mockRejectedValue(
      new Error("Alert notification service timeout")
    );

    // Setup database mock behaviors
    mockDatabase.beginTransaction.mockResolvedValue({
      transactionId: "txn-20240115-001",
    });
    mockDatabase.insertDataQualityValidation.mockResolvedValue(
      dataQualityValidationResult.validationId
    );
    mockDatabase.insertProposalAnalysisScore.mockResolvedValue(
      proposalAnalysisScoreResult.analysisId
    );
    mockDatabase.insertInappropriatePatternResult.mockResolvedValue(
      inappropriatePatternResult.patternId
    );
    mockDatabase.deleteDataQualityValidation.mockResolvedValue(true);
    mockDatabase.deleteProposalAnalysisScore.mockResolvedValue(true);
    mockDatabase.deleteInappropriatePatternResult.mockResolvedValue(true);
    mockDatabase.rollbackTransaction.mockResolvedValue(true);
    mockDatabase.insertAuditLog.mockResolvedValue({
      auditLogId: "audit-20240115-001",
    });
    mockDatabase.queryAuditLog.mockResolvedValue([
      {
        auditLogId: "audit-20240115-001",
        eventType: "Tx10Imp1Agent_Execution_Failed",
        eventDescription:
          "Tx10Imp1Agent execution failed, compensation transaction executed",
        salesDataId: "sd-20240115-001",
        timestamp: "2024-01-15T10:34:00Z",
        compensationStatus: "completed",
      },
    ]);

    // Setup cache mock behaviors
    mockCache.set.mockResolvedValue(true);
    mockCache.delete.mockResolvedValue(true);

    // Setup notification service mock behaviors
    mockNotificationService.sendToAdmin.mockResolvedValue({
      notificationId: "notif-20240115-001",
      status: "sent",
    });

    // Execute the agent with dependency injection
    const agentExecutionPromise = runTx10Imp1Agent(
      inputSalesData,
      mockAiClient,
      mockDatabase,
      mockCache,
      mockNotificationService
    );

    // Verify that the agent execution fails as expected
    await expect(agentExecutionPromise).rejects.toThrow(/notification/i);

    // Verify data quality validation was called
    expect(mockAiClient.validateDataQuality).toHaveBeenCalledWith(
      inputSalesData
    );

    // Verify proposal analysis was called
    expect(mockAiClient.analyzeProposalContent).toHaveBeenCalledWith(
      inputSalesData
    );

    // Verify pattern detection was called
    expect(mockAiClient.detectInappropriatePattern).toHaveBeenCalledWith(
      inputSalesData
    );

    // Verify alert notification was attempted
    expect(mockAiClient.sendAlertNotification).toHaveBeenCalled();

    // Verify transaction began
    expect(mockDatabase.beginTransaction).toHaveBeenCalled();

    // Verify data quality validation record was inserted
    expect(mockDatabase.insertDataQualityValidation).toHaveBeenCalledWith(
      dataQualityValidationResult
    );

    // Verify proposal analysis score record was inserted
    expect(mockDatabase.insertProposalAnalysisScore).toHaveBeenCalledWith(
      proposalAnalysisScoreResult
    );

    // Verify inappropriate pattern result record was inserted
    expect(mockDatabase.insertInappropriatePatternResult).toHaveBeenCalledWith(
      inappropriatePatternResult
    );

    // Verify rollback was executed (compensation transaction)
    expect(mockDatabase.rollbackTransaction).toHaveBeenCalled();

    // Verify data quality validation record was deleted during rollback
    expect(mockDatabase.deleteDataQualityValidation).toHaveBeenCalledWith(
      dataQualityValidationResult.validationId
    );

    // Verify proposal analysis score record was deleted during rollback
    expect(mockDatabase.deleteProposalAnalysisScore).toHaveBeenCalledWith(
      proposalAnalysisScoreResult.analysisId
    );

    // Verify inappropriate pattern result record was deleted during rollback
    expect(mockDatabase.deleteInappropriatePatternResult).toHaveBeenCalledWith(
      inappropriatePatternResult.patternId
    );

    // Verify audit log was recorded for compensation transaction
    expect(mockDatabase.insertAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "Tx10Imp1Agent_Execution_Failed",
        eventDescription:
          "Tx10Imp1Agent execution failed, compensation transaction executed",
        salesDataId: "sd-20240115-001",
        compensationStatus: "completed",
      })
    );

    // Verify compensation transaction recorded in audit log
    const auditLogs = await mockDatabase.queryAuditLog(
      "Tx10Imp1Agent_Execution_Failed"
    );
    expect(auditLogs).toHaveLength(1);
    expect(auditLogs[0].eventDescription).toMatch(
      /compensation transaction executed/i
    );
    expect(auditLogs[0].compensationStatus).toBe("completed");

    // Verify cache was cleared for this transaction
    expect(mockCache.delete).toHaveBeenCalled();

    // Verify admin notification was sent with error details
    expect(mockNotificationService.sendToAdmin).toHaveBeenCalledWith(
      expect.objectContaining({
        errorType: "notification_failure",
        salesDataId: "sd-20240115-001",
        compensationExecuted: true,
        details: expect.stringContaining("notification"),
      })
    );

    // Verify that no records remain in database after compensation
    // (By verifying delete operations were called for all inserted records)
    const deleteCallCount =
      mockDatabase.deleteDataQualityValidation.mock.calls.length +
      mockDatabase.deleteProposalAnalysisScore.mock.calls.length +
      mockDatabase.deleteInappropriatePatternResult.mock.calls.length;
    const insertCallCount =
      mockDatabase.insertDataQualityValidation.mock.calls.length +
      mockDatabase.insertProposalAnalysisScore.mock.calls.length +
      mockDatabase.insertInappropriatePatternResult.mock.calls.length;

    expect(deleteCallCount).toBe(insertCallCount);
    expect(deleteCallCount).toBe(3);

    // Verify system returned to safe state
    const finalState = await mockDatabase.queryAuditLog(
      "Tx10Imp1Agent_Execution_Failed"
    );
    expect(finalState[0].compensationStatus).toBe("completed");
  });
});