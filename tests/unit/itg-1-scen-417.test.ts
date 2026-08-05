import { analyzeSuccessPatternApplicability } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-417: 成功パターン適用判定機能 - 逆順で与えられたパターンを正しく成約率順に並べ替える", () => {
    // Arrange: 成約率が低い順（昇順）に並んだ成功パターンデータを用意
    const unsorted_patterns = [
      {
        pattern_id: "pat_001",
        success_rate: 10,
        customer_segment: "SMB",
        product_category: "基本パッケージ",
        approach_type: "メール提案",
      },
      {
        pattern_id: "pat_002",
        success_rate: 20,
        customer_segment: "SMB",
        product_category: "標準パッケージ",
        approach_type: "電話確認",
      },
      {
        pattern_id: "pat_003",
        success_rate: 30,
        customer_segment: "中堅企業",
        product_category: "標準パッケージ",
        approach_type: "対面提案",
      },
      {
        pattern_id: "pat_004",
        success_rate: 40,
        customer_segment: "中堅企業",
        product_category: "プレミアムパッケージ",
        approach_type: "ワークショップ",
      },
      {
        pattern_id: "pat_005",
        success_rate: 50,
        customer_segment: "大企業",
        product_category: "プレミアムパッケージ",
        approach_type: "コンサルティング",
      },
    ];

    // Act: 成功パターン適用判定機能に逆順データを入力
    const result = analyzeSuccessPatternApplicability({
      patterns: unsorted_patterns,
      current_deal_attributes: {
        customer_segment: "中堅企業",
        product_category: "標準パッケージ",
        deal_stage: "提案段階",
      },
    });

    // Assert: ソート結果の成功パターンが成約率降順（高い順）に並んでいることを確認
    expect(result.sorted_patterns).toBeDefined();
    expect(result.sorted_patterns.length).toBe(5);

    // 期待結果: 成約率50%、40%、30%、20%、10%の順序で返される
    expect(result.sorted_patterns[0].success_rate).toBe(50);
    expect(result.sorted_patterns[0].pattern_id).toBe("pat_005");

    expect(result.sorted_patterns[1].success_rate).toBe(40);
    expect(result.sorted_patterns[1].pattern_id).toBe("pat_004");

    expect(result.sorted_patterns[2].success_rate).toBe(30);
    expect(result.sorted_patterns[2].pattern_id).toBe("pat_003");

    expect(result.sorted_patterns[3].success_rate).toBe(20);
    expect(result.sorted_patterns[3].pattern_id).toBe("pat_002");

    expect(result.sorted_patterns[4].success_rate).toBe(10);
    expect(result.sorted_patterns[4].pattern_id).toBe("pat_001");

    // 各パターンが成約率降順に整列されていることを連続検証
    for (let i = 0; i < result.sorted_patterns.length - 1; i++) {
      expect(result.sorted_patterns[i].success_rate).toBeGreaterThanOrEqual(
        result.sorted_patterns[i + 1].success_rate
      );
    }
  });
});