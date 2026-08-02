import { revalidateCorrectedDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-420
  test("修正済みデータが全ての品質ルールを満たす場合、合格判定が返される", () => {
    const corrected_data = {
      customer_name: "山田太郎",
      sales_amount: 500000,
      deal_stage: "クローズ",
      last_updated: "2024-01-15",
    };

    const quality_rules = [
      {
        rule_id: "rule_001",
        rule_name: "顧客名必須チェック",
        rule_type: "required",
        target_field: "customer_name",
        result: true,
      },
      {
        rule_id: "rule_002",
        rule_name: "売上金額数値チェック",
        rule_type: "numeric",
        target_field: "sales_amount",
        result: true,
      },
      {
        rule_id: "rule_003",
        rule_name: "商談ステージ値域チェック",
        rule_type: "enum",
        target_field: "deal_stage",
        valid_values: ["初回接触", "提案", "交渉", "クローズ"],
        result: true,
      },
      {
        rule_id: "rule_004",
        rule_name: "最終更新日日付形式チェック",
        rule_type: "date_format",
        target_field: "last_updated",
        result: true,
      },
    ];

    const validation_result = revalidateCorrectedDataQuality(
      corrected_data,
      quality_rules
    );

    expect(validation_result.judgment_status).toBe("合格");
    expect(validation_result.error_messages).toEqual([]);
    expect(validation_result.checked_rules_count).toBe(4);
    expect(validation_result.passed_rules_count).toBe(4);
  });
});