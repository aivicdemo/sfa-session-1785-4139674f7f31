import { runTx1Imp1Agent } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-1239
  test("データ抽出から品質検証・クリーニングまでの自動実行 AIエージェント - 途中失敗時に完了済みの副作用を巻き戻す", async () => {
    const extractionStartDate = "2024-01-01T00:00:00Z";
    const extractionEndDate = "2024-01-31T23:59:59Z";
    const totalLogCount = 100;
    const registrationFailurePointIndex = 70;

    const mockExtractionLogs = Array.from({ length: totalLogCount }, (_, i) => ({
      id: `log_${i + 1}`,
      timestamp: new Date(
        new Date(extractionStartDate).getTime() +
          (i * 24 * 60 * 60 * 1000) % (31 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      salespersonId: `sp_${(i % 10) + 1}`,
      activityType: ["call", "visit", "email"][i % 3],
      customerId: `cust_${(i % 20) + 1}`,
      duration: 15 + (i % 45),
      notes: `Activity note ${i + 1}`,
    }));

    const mockProcessLog: Array<{
      id: string;
      executionId: string;
      stepName: string;
      status: "pending" | "completed" | "failed" | "rolled_back";
      timestamp: string;
      details?: string;
    }> = [];

    const mockRollbackStateTable: Array<{
      componentName: string;
      state: "initial" | "extracted" | "validated" | "cleaned" | "registered";
    }> = [
      { componentName: "source_system", state: "initial" },
      { componentName: "quality_validation", state: "initial" },
      { componentName: "data_cleaning", state: "initial" },
      { componentName: "target_system_registration", state: "initial" },
    ];

    const mockAuditEvents: Array<{
      eventId: string;
      eventType: string;
      executionId: string;
      timestamp: string;
      details: string;
    }> = [];

    const mockAnalysisSystemData: Array<{ id: string; data: object }> = [];

    const executionId = `exec_${Date.now()}`;

    const createMockAiClient = () => ({
      extractSalesProcessLogs: jest
        .fn()
        .mockResolvedValue(mockExtractionLogs),
      validateDataCompleteness: jest.fn().mockResolvedValue({
        isValid: true,
        totalRecords: totalLogCount,
        invalidRecords: [],
      }),
      calculateDataQualityScore: jest.fn().mockResolvedValue({
        overallScore: 92,
        missingFieldsDetected: [],
      }),
      detectDuplicates: jest.fn().mockResolvedValue({
        duplicateGroups: [],
        confidence: 0.98,
      }),
      normalizeDataByRules: jest.fn().mockResolvedValue({
        normalizedRecords: mockExtractionLogs.map((log, i) => ({
          ...log,
          normalized: true,
          recordIndex: i + 1,
        })),
        rulesApplied: 5,
      }),
      revalidateNormalizedData: jest.fn().mockResolvedValue({
        isValid: true,
        normalizedDataQualityScore: 94,
      }),
      registerDataToAnalysisSystem: jest
        .fn()
        .mockImplementation(async (records) => {
          for (const record of records) {
            if (
              record.recordIndex &&
              record.recordIndex >= registrationFailurePointIndex
            ) {
              const errorEvent = {
                eventId: `err_${Date.now()}_${Math.random()}`,
                eventType: "registration_error",
                executionId: executionId,
                timestamp: new Date().toISOString(),
                details: "HTTP 500 from analysis system",
              };
              mockAuditEvents.push(errorEvent);
              mockProcessLog.push({
                id: `log_${Date.now()}`,
                executionId: executionId,
                stepName: "register_data_to_analysis_system",
                status: "failed",
                timestamp: new Date().toISOString(),
                details: "Registration failed at record index " + record.recordIndex,
              });
              throw new Error("HTTP 500 Error from analysis system");
            }
            mockAnalysisSystemData.push({ id: record.id, data: record });
          }
          return { registeredCount: records.length };
        }),
    });

    const mockStateManager = {
      saveExtractionState: jest.fn(async (state) => {
        mockRollbackStateTable[0].state = "extracted";
        mockProcessLog.push({
          id: `log_${Date.now()}`,
          executionId: executionId,
          stepName: "extract_logs",
          status: "completed",
          timestamp: new Date().toISOString(),
        });
      }),
      saveValidationState: jest.fn(async (state) => {
        mockRollbackStateTable[1].state = "validated";
        mockProcessLog.push({
          id: `log_${Date.now()}`,
          executionId: executionId,
          stepName: "validate_completeness",
          status: "completed",
          timestamp: new Date().toISOString(),
        });
      }),
      saveCleaningState: jest.fn(async (state) => {
        mockRollbackStateTable[2].state = "cleaned";
        mockProcessLog.push({
          id: `log_${Date.now()}`,
          executionId: executionId,
          stepName: "normalize_data",
          status: "completed",
          timestamp: new Date().toISOString(),
        });
      }),
      saveRegistrationState: jest.fn(async (state) => {
        mockRollbackStateTable[3].state = "registered";
        mockProcessLog.push({
          id: `log_${Date.now()}`,
          executionId: executionId,
          stepName: "register_data",
          status: "completed",
          timestamp: new Date().toISOString(),
        });
      }),
      rollbackExtractionState: jest.fn(async () => {
        mockRollbackStateTable[0].state = "initial";
        mockProcessLog.push({
          id: `log_${Date.now()}`,
          executionId: executionId,
          stepName: "rollback_extraction_state",
          status: "completed",
          timestamp: new Date().toISOString(),
        });
      }),
      rollbackValidationState: jest.fn(async () => {
        mockRollbackStateTable[1].state = "initial";
        mockProcessLog.push({
          id: `log_${Date.now()}`,
          executionId: executionId,
          stepName: "rollback_validation_state",
          status: "completed",
          timestamp: new Date().toISOString(),
        });
      }),
      rollbackCleaningState: jest.fn(async () => {
        mockRollbackStateTable[2].state = "initial";
        mockProcessLog.push({
          id: `log_${Date.now()}`,
          executionId: executionId,
          stepName: "rollback_cleaning_state",
          status: "completed",
          timestamp: new Date().toISOString(),
        });
      }),
      rollbackRegistrationState: jest.fn(async () => {
        mockRollbackStateTable[3].state = "initial";
        mockProcessLog.push({
          id: `log_${Date.now()}`,
          executionId: executionId,
          stepName: "rollback_registration_state",
          status: "completed",
          timestamp: new Date().toISOString(),
        });
      }),
    };

    const mockAuditLogger = {
      logEvent: jest.fn(async (eventType, details) => {
        mockAuditEvents.push({
          eventId: `audit_${Date.now()}_${Math.random()}`,
          eventType: eventType,
          executionId: executionId,
          timestamp: new Date().toISOString(),
          details: details,
        });
      }),
    };

    const aiClient = createMockAiClient();

    const result = await runTx1Imp1Agent({
      executionId: executionId,
      extractionStartDate: extractionStartDate,
      extractionEndDate: extractionEndDate,
      aiClient: aiClient,
      stateManager: mockStateManager,
      auditLogger: mockAuditLogger,
    }).catch((error) => {
      return { error: error.message, status: "failed" };
    });

    expect(result).toEqual({
      error: expect.stringContaining("HTTP 500"),
      status: "failed",
    });

    expect(mockProcessLog.length).toBeGreaterThan(0);

    const extractionLog = mockProcessLog.find((log) =>
      log.stepName.includes("extract")
    );
    expect(extractionLog).toBeDefined();
    expect(extractionLog?.status).toBe("completed");

    const validationLog = mockProcessLog.find((log) =>
      log.stepName.includes("validate")
    );
    expect(validationLog).toBeDefined();
    expect(validationLog?.status).toBe("completed");

    const qualityLog = mockProcessLog.find((log) =>
      log.stepName.includes("quality") || log.stepName.includes("calculate")
    );
    expect(qualityLog).toBeDefined();

    const duplicateLog = mockProcessLog.find((log) =>
      log.stepName.includes("duplicate")
    );
    expect(duplicateLog).toBeDefined();

    const cleaningLog = mockProcessLog.find((log) =>
      log.stepName.includes("normalize")
    );
    expect(cleaningLog).toBeDefined();
    expect(cleaningLog?.status).toBe("completed");

    const revalidationLog = mockProcessLog.find((log) =>
      log.stepName.includes("revalidate")
    );
    expect(revalidationLog).toBeDefined();

    const registrationFailureLog = mockProcessLog.find((log) =>
      log.stepName.includes("register") && log.status === "failed"
    );
    expect(registrationFailureLog).toBeDefined();

    const rollbackExtractionLog = mockProcessLog.find(
      (log) => log.stepName === "rollback_extraction_state"
    );
    expect(rollbackExtractionLog).toBeDefined();
    expect(rollbackExtractionLog?.status).toBe("completed");

    const rollbackValidationLog = mockProcessLog.find(
      (log) => log.stepName === "rollback_validation_state"
    );
    expect(rollbackValidationLog).toBeDefined();
    expect(rollbackValidationLog?.status).toBe("completed");

    const rollbackCleaningLog = mockProcessLog.find(
      (log) => log.stepName === "rollback_cleaning_state"
    );
    expect(rollbackCleaningLog).toBeDefined();
    expect(rollbackCleaningLog?.status).toBe("completed");

    const rollbackRegistrationLog = mockProcessLog.find(
      (log) => log.stepName === "rollback_registration_state"
    );
    expect(rollbackRegistrationLog).toBeDefined();
    expect(rollbackRegistrationLog?.status).toBe("completed");

    expect(mockRollbackStateTable).toEqual([
      { componentName: "source_system", state: "initial" },
      { componentName: "quality_validation", state: "initial" },
      { componentName: "data_cleaning", state: "initial" },
      { componentName: "target_system_registration", state: "initial" },
    ]);

    const registrationErrorEvent = mockAuditEvents.find(
      (event) => event.eventType === "registration_error"
    );
    expect(registrationErrorEvent).toBeDefined();

    const agentFailureEvent = mockAuditEvents.find(
      (event) => event.eventType === "agent_execution_failure"
    );
    expect(agentFailureEvent).toBeDefined();

    const rollbackExecutionEvent = mockAuditEvents.find(
      (event) => event.eventType === "rollback_execution"
    );
    expect(rollbackExecutionEvent).toBeDefined();

    const rollbackSuccessEvent = mockAuditEvents.find(
      (event) => event.eventType === "rollback_success"
    );
    expect(rollbackSuccessEvent).toBeDefined();

    expect(mockAnalysisSystemData.length).toBe(0);

    expect(mockProcessLog.length).toBeGreaterThanOrEqual(11);
  });
});