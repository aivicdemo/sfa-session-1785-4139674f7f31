import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { recordConsolidationJudgment } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化 - 統合判定履歴記録", () => {
  // SCEN-1056
  test("統合判定の結果が統合判定履歴テーブルに記録される", async () => {
    const test_customer_id = "C00123";
    const test_duplicate_result = "重複あり";
    const test_normalization_result = "姓名の表記ゆれ統一";
    const test_consolidation_status = "完了";
    const test_execution_timestamp = new Date("2024-01-15T11:00:00Z");
    const test_timestamp_tolerance_minutes = 1;

    const input_consolidation_judgment = {
      customer_id: test_customer_id,
      duplicate_detection_result: test_duplicate_result,
      normalization_result: test_normalization_result,
      consolidation_status: test_consolidation_status,
      execution_timestamp: test_execution_timestamp,
    };

    const result = await recordConsolidationJudgment(
      input_consolidation_judgment
    );

    expect(result).toEqual({
      customer_id: test_customer_id,
      duplicate_detection_result: test_duplicate_result,
      normalization_result: test_normalization_result,
      consolidation_status: test_consolidation_status,
      execution_timestamp: expect.any(Date),
      history_record_id: expect.any(String),
    });

    const execution_time = result.execution_timestamp.getTime();
    const expected_time = test_execution_timestamp.getTime();
    const tolerance_ms = test_timestamp_tolerance_minutes * 60 * 1000;

    expect(Math.abs(execution_time - expected_time)).toBeLessThanOrEqual(
      tolerance_ms
    );
    expect(result.customer_id).toBe(test_customer_id);
    expect(result.duplicate_detection_result).toBe(test_duplicate_result);
    expect(result.normalization_result).toBe(test_normalization_result);
    expect(result.consolidation_status).toBe(test_consolidation_status);
    expect(result.history_record_id).toBeTruthy();
  });
});