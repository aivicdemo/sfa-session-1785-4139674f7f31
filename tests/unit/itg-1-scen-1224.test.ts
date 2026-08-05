import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import {
  runTx1Imp1Agent,
  Tx1Imp1AiClient,
  ProcessLogExtractionResult,
  DataQualityAssessment,
} from "../../src/logic/it-1";

interface FakeAiClientConfig {
  qualityScore: number;
  defectItems: Array<{
    id: string;
    issue: string;
    field: string;
  }>;
  defectCount: number;
}

interface AuditLogEntry {
  timestamp: string;
  action: string;
  qualityScore?: number;
  defectItemCount?: number;
  defectDetails?: Array<{
    id: string;
    issue: string;
    field: string;
  }>;
}

class FakeTx1Imp1AiClient implements Tx1Imp1AiClient {
  private config: FakeAiClientConfig;
  private auditLogs: AuditLogEntry[] = [];

  constructor(config: FakeAiClientConfig) {
    this.config = config;
  }

  async assessDataQuality(
    data: Array<Record<string, unknown>>
  ): Promise<DataQualityAssessment> {
    const assessment: DataQualityAssessment = {
      qualityScore: this.config.qualityScore,
      defectItems: this.config.defectItems,
      defectCount: this.config.defectCount,
    };

    this.auditLogs.push({
      timestamp: new Date("2024-01-15T11:00:00Z").toISOString(),
      action: "data_quality_assessment",
      qualityScore: this.config.qualityScore,
      defectItemCount: this.config.defectCount,
      defectDetails: this.config.defectItems,
    });

    return assessment;
  }

  getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }

  resetAuditLogs(): void {
    this.auditLogs = [];
  }
}

describe("営業プロセス実行状況の監査ダッシュボード - データ品質検証", () => {
  let fakeClient: FakeTx1Imp1AiClient;
  let mockProcessLogs: Array<Record<string, unknown>>;

  beforeEach(() => {
    fakeClient = new FakeTx1Imp1AiClient({
      qualityScore: 0.82,
      defectItems: [
        { id: "LOG_001", issue: "missing_value", field: "sales_amount" },
        { id: "LOG_023", issue: "invalid_format", field: "phone_number" },
        { id: "LOG_045", issue: "invalid_format", field: "email" },
        { id: "LOG_067", issue: "missing_value", field: "customer_id" },
        { id: "LOG_089", issue: "invalid_format", field: "date_contacted" },
        { id: "LOG_101", issue: "missing_value", field: "contact_method" },
        { id: "LOG_123", issue: "invalid_format", field: "sales_stage" },
        { id: "LOG_145", issue: "duplicate_record", field: "transaction_id" },
        { id: "LOG_167", issue: "invalid_format", field: "region_code" },
        { id: "LOG_189", issue: "missing_value", field: "product_code" },
        { id: "LOG_201", issue: "invalid_format", field: "account_number" },
        { id: "LOG_223", issue: "missing_value", field: "deal_value" },
        { id: "LOG_245", issue: "invalid_format", field: "notes" },
      ],
      defectCount: 13,
    });

    mockProcessLogs = Array.from({ length: 95 }, (_, idx) => ({
      log_id: `LOG_${String(idx + 1).padStart(3, "0")}`,
      timestamp: new Date("2024-01-15T10:00:00Z").toISOString(),
      salesperson_id: `SP_${String((idx % 10) + 1).padStart(2, "0")}`,
      customer_id: `CUST_${String((idx % 20) + 1).padStart(3, "0")}`,
      activity_type: "call",
      sales_amount: Math.floor(Math.random() * 100000),
    }));
  });

  afterEach(() => {
    fakeClient.resetAuditLogs();
  });

  // SCEN-1224
  test("should execute data quality assessment and identify defects within threshold", async () => {
    const extractPeriodStart = "2024-01-01";
    const extractPeriodEnd = "2024-01-31";
    const qualityThreshold = 0.8;

    const assessment = await fakeClient.assessDataQuality(mockProcessLogs);

    expect(assessment.qualityScore).toBe(0.82);
    expect(assessment.qualityScore).toBeGreaterThanOrEqual(qualityThreshold);
    expect(assessment.defectCount).toBe(13);
    expect(assessment.defectItems).toHaveLength(13);

    const defectItemIds = assessment.defectItems.map((item) => item.id);
    expect(defectItemIds).toEqual([
      "LOG_001",
      "LOG_023",
      "LOG_045",
      "LOG_067",
      "LOG_089",
      "LOG_101",
      "LOG_123",
      "LOG_145",
      "LOG_167",
      "LOG_189",
      "LOG_201",
      "LOG_223",
      "LOG_245",
    ]);

    const missingValueDefects = assessment.defectItems.filter(
      (item) => item.issue === "missing_value"
    );
    expect(missingValueDefects).toHaveLength(5);

    const invalidFormatDefects = assessment.defectItems.filter(
      (item) => item.issue === "invalid_format"
    );
    expect(invalidFormatDefects).toHaveLength(7);

    const duplicateDefects = assessment.defectItems.filter(
      (item) => item.issue === "duplicate_record"
    );
    expect(duplicateDefects).toHaveLength(1);

    const fieldsList = assessment.defectItems.map((item) => item.field);
    expect(fieldsList).toContain("sales_amount");
    expect(fieldsList).toContain("phone_number");
    expect(fieldsList).toContain("email");
    expect(fieldsList).toContain("customer_id");
    expect(fieldsList).toContain("contact_method");

    const auditLogs = fakeClient.getAuditLogs();
    expect(auditLogs).toHaveLength(1);

    const auditEntry = auditLogs[0];
    expect(auditEntry.action).toBe("data_quality_assessment");
    expect(auditEntry.qualityScore).toBe(0.82);
    expect(auditEntry.defectItemCount).toBe(13);
    expect(auditEntry.defectDetails).toHaveLength(13);
    expect(auditEntry.timestamp).toBe("2024-01-15T11:00:00.000Z");

    const escalationConditionMet =
      assessment.qualityScore < qualityThreshold;
    expect(escalationConditionMet).toBe(false);

    expect(mockProcessLogs).toHaveLength(95);
    expect(assessment.defectCount).toBeLessThan(mockProcessLogs.length);
  });
});