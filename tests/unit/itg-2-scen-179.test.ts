import { assignPriorityByQualityScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-179
  test("品質検証結果が1件のとき、その検証結果に基づき優先度1が割り当てられる", () => {
    const validation_result = {
      validation_result_id: "VR001",
      quality_score: 70,
      rule_id: "RULE001",
      data_type: "customer_master",
      error_count: 3,
      created_at: new Date("2024-01-15T10:00:00Z"),
    };

    const assigned_priority = assignPriorityByQualityScore(validation_result);

    expect(assigned_priority).toBe(1);
  });
});