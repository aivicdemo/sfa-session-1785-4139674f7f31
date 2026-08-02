import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { detectDuplicateCustomersAndJudgeIntegration } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-461
  test("正規化ルール件数が0件の場合、正規化を適用せずに判定を実行する", () => {
    const input_customer_a = {
      customer_id: "CUST_001",
      customer_name: "田中　太郎",
      normalized_name: null,
    };

    const input_customer_b = {
      customer_id: "CUST_002",
      customer_name: "田中太郎",
      normalized_name: null,
    };

    const normalization_rules: Array<{
      rule_id: string;
      rule_type: string;
      priority: number;
    }> = [];

    const result = detectDuplicateCustomersAndJudgeIntegration(
      [input_customer_a, input_customer_b],
      normalization_rules
    );

    expect(result.duplicate_detected).toBe(false);
    expect(result.integration_target).toBe(false);
    expect(result.judgment_result).toBe("重複なし");
    expect(result.normalization_applied).toBe(false);
    expect(result.normalization_rules_count).toBe(0);
    expect(result.processing_log).toContain("正規化ルール0件");
    expect(result.status).toBe("normal_completion");
  });
});