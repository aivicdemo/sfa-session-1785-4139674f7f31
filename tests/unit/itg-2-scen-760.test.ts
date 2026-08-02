import { generateSignalDetectionRationale } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-760
  test("信号検出根拠生成機能 - 反応パターンが複数件のとき、根拠に複数パターンのサマリが記載される", () => {
    const reaction_patterns = [
      {
        pattern_id: "pattern_a",
        pattern_name: "売上減少",
        summary_text: "過去3ヶ月の売上が20%以上減少",
      },
      {
        pattern_id: "pattern_b",
        pattern_name: "顧客離脱",
        summary_text: "既存顧客の解約率が5%を超過",
      },
      {
        pattern_id: "pattern_c",
        pattern_name: "単価低下",
        summary_text: "平均受注単価が15%低下",
      },
    ];

    const sales_data = {
      customer_id: "cust_001",
      detected_patterns: ["pattern_a", "pattern_b", "pattern_c"],
      reaction_pattern_list: reaction_patterns,
    };

    const generated_rationale = generateSignalDetectionRationale(sales_data);

    expect(generated_rationale).toContain("過去3ヶ月の売上が20%以上減少");
    expect(generated_rationale).toContain("既存顧客の解約率が5%を超過");
    expect(generated_rationale).toContain("平均受注単価が15%低下");
  });
});