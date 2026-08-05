import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type {
  Tx12Imp1AiClient,
  SalesProcessDeviationAnalysisInput,
  SalesProcessDeviationAnalysisOutput,
  ProcessStepExecutionRecord,
  DeviationAnalysisReport,
} from "../../src/agents/tx-12-imp-1/types";
import { analyzeProcessDeviation } from "../../src/logic/it-1-br-2-1-1";

interface MockAiClientConfig {
  deviationScores?: Map<string, number>;
  reverseOrderDetections?: number;
  auditLogEntries?: string[];
}

class FakeTx12Imp1AiClient implements Tx12Imp1AiClient {
  private config: MockAiClientConfig;

  constructor(config: MockAiClientConfig = {}) {
    this.config = config;
  }

  async analyzeProcessDeviation(
    input: SalesProcessDeviationAnalysisInput
  ): Promise<SalesProcessDeviationAnalysisOutput> {
    const reverseOrderRecords = input.executionRecords.filter(
      (record) => this.isReverseOrderExecution(record)
    );

    const reverseOrderCount = reverseOrderRecords.length;
    const totalRecords = input.executionRecords.length;

    const reverseOrderScores = reverseOrderRecords.map((record) => ({
      record_id: record.record_id,
      deviation_score: 85,
      detected_pattern: "REVERSE_STEP_ORDER",
      deviation_reason: this.generateDeviationReason(record),
    }));

    const normalOrderScores = input.executionRecords
      .filter((record) => !this.isReverseOrderExecution(record))
      .map((record) => ({
        record_id: record.record_id,
        deviation_score: 5,
        detected_pattern: "NORMAL_ORDER",
        deviation_reason: "Execution follows standard process order",
      }));

    const allScores = [...reverseOrderScores, ...normalOrderScores];

    const auditLogEntries = reverseOrderRecords.map((record) => {
      const steps = record.step_execution_timestamps.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      const reversePattern = steps
        .map((step, idx) => {
          if (idx > 0) {
            const prevStepOrder = this.getStepOrder(steps[idx - 1].step_name);
            const currStepOrder = this.getStepOrder(step.step_name);
            return prevStepOrder > currStepOrder ? "DESC" : "ASC";
          }
          return "";
        })
        .filter((p) => p)
        .join(",");
      return `Record ${record.record_id}: Reverse order pattern detected - ${reversePattern}`;
    });

    const report: DeviationAnalysisReport = {
      analysis_period_start: input.analysis_period_start,
      analysis_period_end: input.analysis_period_end,
      total_records_analyzed: totalRecords,
      reverse_order_records_detected: reverseOrderCount,
      deviation_score_results: allScores,
      average_deviation_score_reverse: reverseOrderCount > 0 ? 85 : 0,
      average_deviation_score_normal:
        allScores.filter((s) => s.detected_pattern === "NORMAL_ORDER").length >
        0
          ? 5
          : 0,
      audit_log: auditLogEntries,
      detection_basis:
        reverseOrderCount > 0
          ? `${reverseOrderCount} records identified with all 5 process steps executed in reverse order against standard sequence (初期接触→ニーズ確認→提案→交渉→成約). Timestamp comparison shows each step N executed after step N-1.`
          : "No reverse order executions detected",
    };

    return {
      success: true,
      report: report,
      timestamp: new Date("2024-01-15T11:30:00Z").toISOString(),
    };
  }

  private isReverseOrderExecution(record: ProcessStepExecutionRecord): boolean {
    if (!record.step_execution_timestamps || record.step_execution_timestamps.length === 0) {
      return false;
    }

    const sortedByTimestamp = [...record.step_execution_timestamps].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    let isReverse = true;
    for (let i = 1; i < sortedByTimestamp.length; i++) {
      const prevOrder = this.getStepOrder(sortedByTimestamp[i - 1].step_name);
      const currOrder = this.getStepOrder(sortedByTimestamp[i].step_name);
      if (prevOrder <= currOrder) {
        isReverse = false;
        break;
      }
    }

    return isReverse && sortedByTimestamp.length === 5;
  }

  private getStepOrder(stepName: string): number {
    const stepMap: { [key: string]: number } = {
      "初期接触": 1,
      "ニーズ確認": 2,
      提案: 3,
      交渉: 4,
      成約: 5,
    };
    return stepMap[stepName] || 0;
  }

  private generateDeviationReason(record: ProcessStepExecutionRecord): string {
    const timestamps = record.step_execution_timestamps.map((t) => ({
      step: t.step_name,
      time: new Date(t.timestamp),
    }));
    timestamps.sort((a, b) => a.time.getTime() - b.time.getTime());

    const stepSequence = timestamps.map((t) => t.step).join("→");
    return `Execution order ${stepSequence} violates standard sequence (初期接触→ニーズ確認→提案→交渉→成約)`;
  }
}

describe("IT-1-BR-2-1-1: Process Deviation Analysis with Reverse Order Detection", () => {
  let fake_ai_client: FakeTx12Imp1AiClient;

  beforeEach(() => {
    fake_ai_client = new FakeTx12Imp1AiClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1218
  test("should accurately calculate deviation scores when process steps are executed in reverse order", async () => {
    const base_date = new Date("2024-01-10T09:00:00Z");

    // Reverse order execution records (逆順で実行)
    const reverse_order_records: ProcessStepExecutionRecord[] = Array.from(
      { length: 10 },
      (_, idx) => {
        const record_base_time = new Date(
          base_date.getTime() + idx * 24 * 60 * 60 * 1000
        );
        return {
          record_id: `reverse_${idx + 1}`,
          sales_person_id: `sp_${(idx % 3) + 1}`,
          customer_id: `cust_${idx + 1}`,
          deal_id: `deal_reverse_${idx + 1}`,
          step_execution_timestamps: [
            {
              step_name: "成約",
              timestamp: new Date(
                record_base_time.getTime() + 4 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              step_name: "交渉",
              timestamp: new Date(
                record_base_time.getTime() + 3 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              step_name: "提案",
              timestamp: new Date(
                record_base_time.getTime() + 2 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              step_name: "ニーズ確認",
              timestamp: new Date(
                record_base_time.getTime() + 1 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              step_name: "初期接触",
              timestamp: record_base_time.toISOString(),
            },
          ],
        };
      }
    );

    // Normal order execution records (正規順序で実行 - 対照群)
    const normal_order_records: ProcessStepExecutionRecord[] = Array.from(
      { length: 10 },
      (_, idx) => {
        const record_base_time = new Date(
          base_date.getTime() + idx * 24 * 60 * 60 * 1000
        );
        return {
          record_id: `normal_${idx + 1}`,
          sales_person_id: `sp_${(idx % 3) + 1}`,
          customer_id: `cust_normal_${idx + 1}`,
          deal_id: `deal_normal_${idx + 1}`,
          step_execution_timestamps: [
            {
              step_name: "初期接触",
              timestamp: record_base_time.toISOString(),
            },
            {
              step_name: "ニーズ確認",
              timestamp: new Date(
                record_base_time.getTime() + 1 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              step_name: "提案",
              timestamp: new Date(
                record_base_time.getTime() + 2 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              step_name: "交渉",
              timestamp: new Date(
                record_base_time.getTime() + 3 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              step_name: "成約",
              timestamp: new Date(
                record_base_time.getTime() + 4 * 60 * 60 * 1000
              ).toISOString(),
            },
          ],
        };
      }
    );

    const all_execution_records = [
      ...reverse_order_records,
      ...normal_order_records,
    ];

    const analysis_input: SalesProcessDeviationAnalysisInput = {
      analysis_period_start: "2024-01-10T00:00:00Z",
      analysis_period_end: "2024-01-20T23:59:59Z",
      executionRecords: all_execution_records,
      standard_process_definition: {
        step_sequence: [
          "初期接触",
          "ニーズ確認",
          "提案",
          "交渉",
          "成約",
        ],
      },
    };

    const result = await analyzeProcessDeviation(
      analysis_input,
      fake_ai_client
    );

    // (1) Verify all 10 reverse-order records are detected as 'REVERSE_STEP_ORDER'
    const reverse_detections = result.report.deviation_score_results.filter(
      (item) =>
        item.detected_pattern === "REVERSE_STEP_ORDER" &&
        item.record_id.startsWith("reverse_")
    );
    expect(reverse_detections.length).toBe(10);

    // (2) Verify each reverse-order record has deviation score of 80 or higher (standardized at 85)
    reverse_detections.forEach((detection) => {
      expect(detection.deviation_score).toBeGreaterThanOrEqual(80);
      expect(detection.deviation_score).toBeLessThanOrEqual(100);
    });

    // (3) Verify all 10 normal-order records (対照群) have deviation score of 10 or lower
    const normal_detections = result.report.deviation_score_results.filter(
      (item) =>
        item.detected_pattern === "NORMAL_ORDER" &&
        item.record_id.startsWith("normal_")
    );
    expect(normal_detections.length).toBe(10);
    normal_detections.forEach((detection) => {
      expect(detection.deviation_score).toBeLessThanOrEqual(10);
    });

    // (4) Verify score difference is at least 20 points
    const avg_reverse_score =
      reverse_detections.reduce((sum, d) => sum + d.deviation_score, 0) / 10;
    const avg_normal_score =
      normal_detections.reduce((sum, d) => sum + d.deviation_score, 0) / 10;
    const score_difference = avg_reverse_score - avg_normal_score;
    expect(score_difference).toBeGreaterThanOrEqual(20);

    // (5) Verify audit log contains reverse-order pattern detection for each reverse record
    expect(result.report.audit_log.length).toBeGreaterThanOrEqual(10);
    const reverse_pattern_logs = result.report.audit_log.filter((log) =>
      log.includes("Reverse order pattern detected")
    );
    expect(reverse_pattern_logs.length).toBe(10);

    // (6) Verify detection basis describes reverse step execution with timestamp comparison
    expect(result.report.detection_basis).toMatch(/reverse order/i);
    expect(result.report.detection_basis).toMatch(
      /5.*process steps executed in reverse order/i
    );
    expect(result.report.detection_basis).toMatch(/timestamp comparison/i);
    expect(result.report.detection_basis).toMatch(/初期接触→ニーズ確認→提案→交渉→成約/);

    // (7) Verify total records analyzed
    expect(result.report.total_records_analyzed).toBe(20);

    // (8) Verify reverse order records detected count
    expect(result.report.reverse_order_records_detected).toBe(10);

    // (9) Verify average deviation scores
    expect(result.report.average_deviation_score_reverse).toBe(85);
    expect(result.report.average_deviation_score_normal).toBe(5);

    // (10) Verify response success flag and timestamp
    expect(result.success).toBe(true);
    expect(result.timestamp).toBe("2024-01-15T11:30:00Z");
  });
});