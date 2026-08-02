import { visualizeSuccessPatternBasis } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-654
  test("推奨内容根拠の可視化機能 - 成功パターンマスタから抽出した成功パターンが1件のとき、そのパターン条件が正しく適用される", () => {
    const success_patterns = [
      {
        pattern_id: "PAT-001",
        industry: "IT",
        sales_scale: "1000万以上",
        contract_duration: "12ヶ月以上",
        success_count: 15,
        total_attempts: 20,
      },
    ];

    const result = visualizeSuccessPatternBasis(success_patterns);

    expect(result.pattern_count).toBe(1);
    expect(result.patterns).toHaveLength(1);
    expect(result.patterns[0].industry).toBe("IT");
    expect(result.patterns[0].sales_scale).toBe("1000万以上");
    expect(result.patterns[0].contract_duration).toBe("12ヶ月以上");
    expect(result.patterns[0].pattern_id).toBe("PAT-001");
  });
});