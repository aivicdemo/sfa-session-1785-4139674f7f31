import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import type { Tx1Imp1AiClient } from "../../src/agents/tx-1-imp-1/orchestrator";
import { runTx1Imp1Agent } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  let mockAiClient: jest.Mocked<Tx1Imp1AiClient>;
  let mockSalesSystemApi: jest.Mock;
  let processingLogSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    processingLogSpy = jest.fn((logEntry: Record<string, unknown>) => {
      return logEntry;
    });

    mockSalesSystemApi = jest.fn().mockResolvedValue({
      data: Array.from({ length: 100 }, (_, i) => ({
        id: `log_${i + 1}`,
        timestamp: new Date("2024-01-15T10:00:00Z").toISOString(),
        salesPersonId: `sp_${(i % 5) + 1}`,
        customerId: `cust_${(i % 20) + 1}`,
        activityType: i % 3 === 0 ? "visit" : i % 3 === 1 ? "call" : "email",
        description: `Activity ${i + 1}`,
        result: i % 4 === 0 ? "success" : "pending",
      })),
      extractedAt: new Date("2024-01-15T11:00:00Z").toISOString(),
    });

    mockAiClient = {
      analyzeDataQuality: jest.fn().mockResolvedValue({
        quality_score: 55,
        threshold: 70,
        defects: [
          { field: "description", type: "empty_value", count: 5 },
          { field: "result", type: "type_mismatch", count: 3 },
        ],
        escalation_condition: "DataQualityBelowThreshold",
      }),
      extractSalesProcessLogs: jest.fn().mockResolvedValue({
        record_count: 100,
        period_start: "2024-01-01",
        period_end: "2024-01-31",
      }),
      validateExtractedData: jest.fn().mockResolvedValue({
        is_valid: true,
        completeness_check: true,
        format_check: true,
      }),
      escalateToHuman: jest.fn().mockResolvedValue({
        escalation_id: "esc_001",
        status: "awaiting_human_review",
        timestamp: new Date("2024-01-15T11:05:00Z").toISOString(),
      }),
      recordProcessLog: processingLogSpy.mockResolvedValue({
        log_id: "plog_001",
        recorded: true,
      }),
    } as unknown as jest.Mocked<Tx1Imp1AiClient>;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // SCEN-1230
  test("should escalate to human review when data quality score is below threshold before finalizing side effects", async () => {
    const targetPeriod = {
      start_date: "2024-01-01",
      end_date: "2024-01-31",
    };

    const result = await runTx1Imp1Agent({
      aiClient: mockAiClient,
      salesSystemApi: mockSalesSystemApi,
      targetPeriod,
      processLogRecorder: processingLogSpy,
    });

    expect(result.status).toBe("escalation");
    expect(result.escalation_condition).toBe("DataQualityBelowThreshold");
    expect(result.escalation_id).toBe("esc_001");

    expect(mockSalesSystemApi).toHaveBeenCalledWith({
      start_date: "2024-01-01",
      end_date: "2024-01-31",
    });
    expect(mockSalesSystemApi).toHaveBeenCalledTimes(1);

    expect(mockAiClient.extractSalesProcessLogs).toHaveBeenCalled();
    expect(mockAiClient.validateExtractedData).toHaveBeenCalled();
    expect(mockAiClient.analyzeDataQuality).toHaveBeenCalled();

    expect(mockAiClient.escalateToHuman).toHaveBeenCalledWith({
      escalation_condition: "DataQualityBelowThreshold",
      quality_score: 55,
      threshold: 70,
      defects: [
        { field: "description", type: "empty_value", count: 5 },
        { field: "result", type: "type_mismatch", count: 3 },
      ],
    });

    expect(result.processing_log).toBeDefined();
    expect(result.processing_log.extracted_record_count).toBe(100);
    expect(result.processing_log.data_quality_score).toBe(55);
    expect(result.processing_log.defects_detected).toEqual([
      { field: "description", type: "empty_value", count: 5 },
      { field: "result", type: "type_mismatch", count: 3 },
    ]);
    expect(result.processing_log.actions_completed).toContain("extract_logs");
    expect(result.processing_log.actions_completed).toContain("validate_format");
    expect(result.processing_log.actions_completed).toContain(
      "analyze_data_quality"
    );
    expect(result.processing_log.actions_completed).not.toContain(
      "normalize_data"
    );
    expect(result.processing_log.actions_completed).not.toContain(
      "register_to_analysis_system"
    );

    expect(mockAiClient.recordProcessLog).toHaveBeenCalledWith(
      expect.objectContaining({
        extracted_record_count: 100,
        data_quality_score: 55,
        threshold: 70,
        escalation_condition: "DataQualityBelowThreshold",
        status: "escalation_awaiting_human_review",
      })
    );

    expect(result.rollback_eligible_data).toEqual({
      extracted_logs: expect.any(Array),
      validation_results: expect.any(Object),
      quality_analysis: expect.any(Object),
    });

    expect(mockAiClient.normalizeData).not.toHaveBeenCalled();
    expect(mockAiClient.registerToAnalysisSystem).not.toHaveBeenCalled();
  });
});