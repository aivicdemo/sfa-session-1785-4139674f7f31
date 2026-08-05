import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type { Tx1Imp1AiClient } from "../../src/agents/tx-1-imp-1/types";
import { runTx1Imp1Agent } from "../../src/logic/it-1";

interface MockAuditLog {
  timestamp: string;
  action: string;
  status: string;
  recordCount: number;
  details: Record<string, unknown>;
}

interface MockAnalysisSystemResponse {
  registrationId: string;
  recordsProcessed: number;
  recordsRegistered: number;
  timestamp: string;
}

interface MockSalesSystemLog {
  log_id: string;
  sales_person_id: string;
  customer_id: string;
  activity_type: string;
  activity_date: string;
  activity_time: string;
  contact_method: string;
  notes: string;
  phone_number: string;
}

const createMockSalesLog = (index: number): MockSalesSystemLog => ({
  log_id: `LOG-2024-01-${String(index).padStart(5, "0")}`,
  sales_person_id: `SP-${String((index % 10) + 1).padStart(3, "0")}`,
  customer_id: `CUST-${String((index % 50) + 1).padStart(5, "0")}`,
  activity_type: ["visit", "phone", "email"][index % 3],
  activity_date: `2024-01-${String((index % 28) + 1).padStart(2, "0")}`,
  activity_time: `${String((index % 24)).padStart(2, "0")}:${String((index % 60)).padStart(2, "0")}:00`,
  contact_method: ["direct", "indirect"][index % 2],
  notes: `Activity note for record ${index}   `,
  phone_number: `090-1234-${String(index).padStart(4, "0")}`,
});

const createMockAiClient = (): Tx1Imp1AiClient => {
  const auditLogs: MockAuditLog[] = [];

  return {
    extractSalesProcessLogs: async (startDate: string, endDate: string) => {
      const logs: MockSalesSystemLog[] = [];
      for (let i = 1; i <= 100; i++) {
        logs.push(createMockSalesLog(i));
      }
      auditLogs.push({
        timestamp: "2024-01-15T10:00:00Z",
        action: "extract",
        status: "success",
        recordCount: logs.length,
        details: { startDate, endDate },
      });
      return logs;
    },

    validateDataCompleteness: async (logs: MockSalesSystemLog[]) => {
      const requiredFields = [
        "log_id",
        "sales_person_id",
        "customer_id",
        "activity_type",
        "activity_date",
        "activity_time",
        "contact_method",
        "notes",
        "phone_number",
      ];
      const validationResults = logs.map((log) => ({
        log_id: log.log_id,
        allFieldsPresent: requiredFields.every((field) => field in log),
        missingFields: requiredFields.filter((field) => !(field in log)),
      }));
      const passCount = validationResults.filter(
        (v) => v.allFieldsPresent
      ).length;
      auditLogs.push({
        timestamp: "2024-01-15T10:01:00Z",
        action: "validate_completeness",
        status: "success",
        recordCount: passCount,
        details: { totalChecked: logs.length },
      });
      return {
        passedValidation: passCount,
        failedValidation: logs.length - passCount,
        validationResults,
      };
    },

    validateDataFormat: async (logs: MockSalesSystemLog[]) => {
      const formatValidations = logs.map((log) => ({
        log_id: log.log_id,
        dateFormatValid:
          /^\d{4}-\d{2}-\d{2}$/.test(log.activity_date) &&
          new Date(log.activity_date).getTime() > 0,
        timeFormatValid: /^\d{2}:\d{2}:\d{2}$/.test(log.activity_time),
        typeValid: ["visit", "phone", "email"].includes(log.activity_type),
        methodValid: ["direct", "indirect"].includes(log.contact_method),
      }));
      const passCount = formatValidations.filter(
        (v) => v.dateFormatValid && v.timeFormatValid && v.typeValid && v.methodValid
      ).length;
      auditLogs.push({
        timestamp: "2024-01-15T10:02:00Z",
        action: "validate_format",
        status: "success",
        recordCount: passCount,
        details: { totalChecked: logs.length },
      });
      return {
        passedValidation: passCount,
        failedValidation: logs.length - passCount,
        formatValidations,
      };
    },

    calculateDataQualityScore: async (logs: MockSalesSystemLog[]) => {
      const completenessWeight = 0.4;
      const formatWeight = 0.3;
      const uniquenessWeight = 0.3;

      const uniqueLogIds = new Set(logs.map((l) => l.log_id));
      const uniquenessScore = uniqueLogIds.size / logs.length;

      const qualityScore =
        completenessWeight * 1.0 +
        formatWeight * 1.0 +
        uniquenessWeight * uniquenessScore;

      auditLogs.push({
        timestamp: "2024-01-15T10:03:00Z",
        action: "calculate_quality_score",
        status: "success",
        recordCount: logs.length,
        details: { qualityScore: Number(qualityScore.toFixed(2)) },
      });

      return {
        qualityScore: Number(qualityScore.toFixed(2)),
        threshold: 0.95,
        withinThreshold: qualityScore >= 0.95,
      };
    },

    detectDuplicateCustomers: async (logs: MockSalesSystemLog[]) => {
      const customerActivities: Record<string, number> = {};
      logs.forEach((log) => {
        customerActivities[log.customer_id] =
          (customerActivities[log.customer_id] || 0) + 1;
      });

      const duplicateCandidates = Object.entries(customerActivities)
        .filter(([, count]) => count > 1)
        .map(([customerId, count]) => ({
          customerId,
          occurrenceCount: count,
          duplicateConfidence: 1.0,
        }));

      auditLogs.push({
        timestamp: "2024-01-15T10:04:00Z",
        action: "detect_duplicates",
        status: "success",
        recordCount: duplicateCandidates.length,
        details: { totalLogsAnalyzed: logs.length },
      });

      return {
        duplicatesDetected: duplicateCandidates.length,
        mergeCandidates: duplicateCandidates,
      };
    },

    retrieveCleaningRules: async () => {
      const rules = [
        {
          ruleId: "R001",
          name: "Standardize date format",
          pattern: "activity_date",
          operation: "format",
        },
        {
          ruleId: "R002",
          name: "Remove hyphens from phone number",
          pattern: "phone_number",
          operation: "normalize",
        },
        {
          ruleId: "R003",
          name: "Trim whitespace",
          pattern: "notes",
          operation: "trim",
        },
        {
          ruleId: "R004",
          name: "Standardize activity type",
          pattern: "activity_type",
          operation: "normalize",
        },
        {
          ruleId: "R005",
          name: "Remove leading zeros from customer id",
          pattern: "customer_id",
          operation: "normalize",
        },
      ];
      auditLogs.push({
        timestamp: "2024-01-15T10:05:00Z",
        action: "retrieve_cleaning_rules",
        status: "success",
        recordCount: rules.length,
        details: { rulesLoaded: true },
      });
      return rules;
    },

    applyCleningRules: async (
      logs: MockSalesSystemLog[],
      rules: Array<{ ruleId: string; name: string; pattern: string; operation: string }>
    ) => {
      const normalizedLogs = logs.map((log) => ({
        ...log,
        activity_date: log.activity_date,
        phone_number: log.phone_number.replace(/-/g, ""),
        notes: log.notes.trim(),
        activity_type: log.activity_type.toLowerCase(),
        customer_id: log.customer_id,
      }));

      auditLogs.push({
        timestamp: "2024-01-15T10:06:00Z",
        action: "apply_cleaning_rules",
        status: "success",
        recordCount: normalizedLogs.length,
        details: {
          rulesApplied: rules.length,
          ruleIds: rules.map((r) => r.ruleId),
        },
      });

      return normalizedLogs;
    },

    revalidateNormalizedData: async (normalizedLogs: MockSalesSystemLog[]) => {
      const qualityScore =
        normalizedLogs.length > 0 ? 0.95 : 0.0;

      auditLogs.push({
        timestamp: "2024-01-15T10:07:00Z",
        action: "revalidate_normalized_data",
        status: "success",
        recordCount: normalizedLogs.length,
        details: { qualityScore: Number(qualityScore.toFixed(2)) },
      });

      return {
        qualityScore: Number(qualityScore.toFixed(2)),
        threshold: 0.95,
        maintainsThreshold: qualityScore >= 0.95,
      };
    },

    registerToAnalysisSystem: async (
      normalizedLogs: MockSalesSystemLog[]
    ): Promise<MockAnalysisSystemResponse> => {
      const registrationId = `REG-${Date.now()}`;
      const recordsRegistered = normalizedLogs.length;

      auditLogs.push({
        timestamp: "2024-01-15T10:08:00Z",
        action: "register_to_analysis_system",
        status: "success",
        recordCount: recordsRegistered,
        details: {
          registrationId,
          timestamp: "2024-01-15T10:08:00Z",
        },
      });

      return {
        registrationId,
        recordsProcessed: normalizedLogs.length,
        recordsRegistered: recordsRegistered,
        timestamp: "2024-01-15T10:08:00Z",
      };
    },

    recordAuditLogs: async (logs: MockAuditLog[]) => {
      auditLogs.push(...logs);
      return {
        recordsInserted: logs.length,
        insertTimestamp: "2024-01-15T10:09:00Z",
      };
    },

    getAuditLogs: async () => {
      return auditLogs;
    },

    checkEscalationConditions: async (
      qualityScore: number,
      duplicateCount: number,
      registrationErrors: number
    ) => {
      const conditions = {
        qualityBelowThreshold: qualityScore < 0.95,
        highDuplicateCount: duplicateCount > 10,
        registrationErrors: registrationErrors > 0,
      };

      const hasEscalation =
        conditions.qualityBelowThreshold ||
        conditions.highDuplicateCount ||
        conditions.registrationErrors;

      auditLogs.push({
        timestamp: "2024-01-15T10:10:00Z",
        action: "check_escalation_conditions",
        status: hasEscalation ? "escalation_triggered" : "no_escalation",
        recordCount: 0,
        details: conditions,
      });

      return {
        hasEscalation,
        conditions,
      };
    },
  };
};

describe("営業プロセス実行状況の監査ダッシュボード - Tx1Imp1Agent完全実行", () => {
  let mockAiClient: Tx1Imp1AiClient;

  beforeEach(() => {
    mockAiClient = createMockAiClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1221
  test("データ抽出から品質検証・クリーニングまでの自動実行 - 100件の正常データを人の承認なしで完全処理", async () => {
    const startDate = "2024-01-01";
    const endDate = "2024-01-31";
    const extractedLogs = await mockAiClient.extractSalesProcessLogs(
      startDate,
      endDate
    );

    expect(extractedLogs).toHaveLength(100);
    expect(extractedLogs[0]).toHaveProperty("log_id");
    expect(extractedLogs[0]).toHaveProperty("sales_person_id");
    expect(extractedLogs[0]).toHaveProperty("customer_id");
    expect(extractedLogs[0]).toHaveProperty("activity_type");
    expect(extractedLogs[0]).toHaveProperty("activity_date");
    expect(extractedLogs[0]).toHaveProperty("activity_time");
    expect(extractedLogs[0]).toHaveProperty("contact_method");
    expect(extractedLogs[0]).toHaveProperty("notes");
    expect(extractedLogs[0]).toHaveProperty("phone_number");

    const completenessValidation =
      await mockAiClient.validateDataCompleteness(extractedLogs);
    expect(completenessValidation.passedValidation).toBe(100);
    expect(completenessValidation.failedValidation).toBe(0);

    const formatValidation = await mockAiClient.validateDataFormat(extractedLogs);
    expect(formatValidation.passedValidation).toBe(100);
    expect(formatValidation.failedValidation).toBe(0);

    const qualityScoreResult =
      await mockAiClient.calculateDataQualityScore(extractedLogs);
    expect(qualityScoreResult.qualityScore).toBeGreaterThanOrEqual(0.95);
    expect(qualityScoreResult.withinThreshold).toBe(true);

    const duplicateDetection =
      await mockAiClient.detectDuplicateCustomers(extractedLogs);
    expect(duplicateDetection.duplicatesDetected).toBe(0);
    expect(duplicateDetection.mergeCandidates).toHaveLength(0);

    const cleaningRules = await mockAiClient.retrieveCleaningRules();
    expect(cleaningRules).toHaveLength(5);
    expect(cleaningRules.map((r) => r.ruleId)).toEqual(
      expect.arrayContaining(["R001", "R002", "R003", "R004", "R005"])
    );

    const normalizedLogs = await mockAiClient.applyCleningRules(
      extractedLogs,
      cleaningRules
    );
    expect(normalizedLogs).toHaveLength(100);
    expect(normalizedLogs[0].phone_number).not.toContain("-");
    expect(normalizedLogs[0].notes).toBe(normalizedLogs[0].notes.trim());

    const revalidationResult =
      await mockAiClient.revalidateNormalizedData(normalizedLogs);
    expect(revalidationResult.qualityScore).toBeGreaterThanOrEqual(0.95);
    expect(revalidationResult.maintainsThreshold).toBe(true);

    const registrationResult =
      await mockAiClient.registerToAnalysisSystem(normalizedLogs);
    expect(registrationResult.recordsProcessed).toBe(100);
    expect(registrationResult.recordsRegistered).toBe(100);
    expect(registrationResult.registrationId).toMatch(/^REG-\d+$/);

    const escalationCheck = await mockAiClient.checkEscalationConditions(
      qualityScoreResult.qualityScore,
      duplicateDetection.duplicatesDetected,
      0
    );
    expect(escalationCheck.hasEscalation).toBe(false);
    expect(escalationCheck.conditions.qualityBelowThreshold).toBe(false);
    expect(escalationCheck.conditions.highDuplicateCount).toBe(false);
    expect(escalationCheck.conditions.registrationErrors).toBe(false);

    const auditLogs = await mockAiClient.getAuditLogs();
    expect(auditLogs.length).toBeGreaterThanOrEqual(8);

    const extractLog = auditLogs.find((log) => log.action === "extract");
    expect(extractLog).toBeDefined();
    expect(extractLog?.status).toBe("success");
    expect(extractLog?.recordCount).toBe(100);

    const completenessLog = auditLogs.find(
      (log) => log.action === "validate_completeness"
    );
    expect(completenessLog).toBeDefined();
    expect(completenessLog?.status).toBe("success");
    expect(completenessLog?.recordCount).toBe(100);

    const formatLog = auditLogs.find(
      (log) => log.action === "validate_format"
    );
    expect(formatLog).toBeDefined();
    expect(formatLog?.status).toBe("success");
    expect(formatLog?.recordCount).toBe(100);

    const qualityLog = auditLogs.find(
      (log) => log.action === "calculate_quality_score"
    );
    expect(qualityLog).toBeDefined();
    expect(qualityLog?.status).toBe("success");

    const duplicateLog = auditLogs.find(
      (log) => log.action === "detect_duplicates"
    );
    expect(duplicateLog).toBeDefined();
    expect(duplicateLog?.status).toBe("success");
    expect(duplicateLog?.recordCount).toBe(0);

    const rulesLog = auditLogs.find(
      (log) => log.action === "retrieve_cleaning_rules"
    );
    expect(rulesLog).toBeDefined();
    expect(rulesLog?.status).toBe("success");
    expect(rulesLog?.recordCount).toBe(5);

    const cleaningLog = auditLogs.find(
      (log) => log.action === "apply_cleaning_rules"
    );
    expect(cleaningLog).toBeDefined();
    expect(cleaningLog?.status).toBe("success");
    expect(cleaningLog?.recordCount).toBe(100);

    const revalidateLog = auditLogs.find(
      (log) => log.action === "revalidate_normalized_data"
    );
    expect(revalidateLog).toBeDefined();
    expect(revalidateLog?.status).toBe("success");
    expect(revalidateLog?.recordCount).toBe(100);

    const registrationLog = auditLogs.find(
      (log) => log.action === "register_to_analysis_system"
    );
    expect(registrationLog).toBeDefined();
    expect(registrationLog?.status).toBe("success");
    expect(registrationLog?.recordCount).toBe(100);

    const escalationLog = auditLogs.find(
      (log) => log.action === "check_escalation_conditions"
    );
    expect(escalationLog).toBeDefined();
    expect(escalationLog?.status).toBe("no_escalation");

    const result = await runTx1Imp1Agent({
      startDate,
      endDate,
      aiClient: mockAiClient,
    });

    expect(result).toBeDefined();
    expect(result.status).toBe("completed");
    expect(result.processedRecords).toBe(100);
    expect(result.registeredRecords).toBe(100);
    expect(result.executionTimestamp).toBeDefined();
  });
});