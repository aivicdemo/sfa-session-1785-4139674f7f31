import { detectDeviationPatterns } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 乖離パターン検出", () => {
  // SCEN-309
  test("乖離パターン定義マスタが複数件のとき、全定義に対して照合が実行される", () => {
    const deviationDefinitions = [
      {
        definition_id: "DEF-001",
        pattern_name: "売上減少",
        condition: {
          type: "sales_decline",
          threshold_percent: 50,
        },
      },
      {
        definition_id: "DEF-002",
        pattern_name: "案件未更新",
        condition: {
          type: "stale_deal",
          days_threshold: 30,
        },
      },
      {
        definition_id: "DEF-003",
        pattern_name: "顧客属性矛盾",
        condition: {
          type: "customer_attribute_mismatch",
        },
      },
    ];

    const salesData = {
      sales_amount_current: 400000,
      sales_amount_previous: 1000000,
      deal_status: "completed",
      deal_last_updated: "2024-01-05T10:00:00Z",
      current_date: "2024-02-05T10:00:00Z",
      customer_id: "CUST-001",
      sales_person_id: "SP-001",
    };

    const result = detectDeviationPatterns(
      deviationDefinitions,
      salesData
    );

    expect(result).toEqual([
      {
        definition_id: "DEF-001",
        pattern_name: "売上減少",
        matched: true,
      },
      {
        definition_id: "DEF-002",
        pattern_name: "案件未更新",
        matched: true,
      },
      {
        definition_id: "DEF-003",
        pattern_name: "顧客属性矛盾",
        matched: true,
      },
    ]);

    expect(result).toHaveLength(3);
    expect(result.every((r) => "definition_id" in r)).toBe(true);
    expect(result.every((r) => "matched" in r)).toBe(true);
  });
});