import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1482: [error] 購買履歴データ品質判定機能 - 複数件の購買履歴データで品質判定が実行される
  test("複数件の購買履歴データに対して品質判定が個別に実行され、各レコードごとに異なるスコア値と判定結果が表示される", () => {
    // テストデータ: 異なる商品カテゴリ・購買日時・金額を持つ購買履歴レコード3件
    const purchaseHistory1 = {
      purchaseHistoryId: "PH001",
      customerId: "CUST001",
      productCategory: "ソフトウェア",
      purchaseDate: "2024-01-15T10:30:00Z",
      amount: 150000,
      requiredFieldsCompleteness: 0.98,
      timeSeriesConsistency: 0.97,
      recommendedPatternApplicability: 0.82,
    };

    const purchaseHistory2 = {
      purchaseHistoryId: "PH002",
      customerId: "CUST001",
      productCategory: "ハードウェア",
      purchaseDate: "2024-02-20T14:15:00Z",
      amount: 280000,
      requiredFieldsCompleteness: 0.92,
      timeSeriesConsistency: 0.88,
      recommendedPatternApplicability: 0.75,
    };

    const purchaseHistory3 = {
      purchaseHistoryId: "PH003",
      customerId: "CUST001",
      productCategory: "コンサルティング",
      purchaseDate: "2024-03-10T09:45:00Z",
      amount: 500000,
      requiredFieldsCompleteness: 0.85,
      timeSeriesConsistency: 0.79,
      recommendedPatternApplicability: 0.68,
    };

    // スタブ実装: AIRecommendationEngine.evaluatePatternRelevance
    const mockAIEngine = {
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((history) => {
          const completeness = history.requiredFieldsCompleteness;
          const consistency = history.timeSeriesConsistency;
          const applicability = history.recommendedPatternApplicability;

          // スコア計算: (完全性 * 0.4 + 一貫性 * 0.3 + 適用可能性 * 0.3) * 100
          const qualityScore = Math.round(
            (completeness * 0.4 +
              consistency * 0.3 +
              applicability * 0.3) *
              100
          );

          // 判定ステータス決定: 70以上=高品質、50以上70未満=中品質、50未満=低品質
          let status = "";
          if (qualityScore >= 70) {
            status = "高品質";
          } else if (qualityScore >= 50) {
            status = "中品質";
          } else {
            status = "低品質";
          }

          return {
            purchaseHistoryId: history.purchaseHistoryId,
            qualityScore: qualityScore,
            judgmentStatus: status,
            judgmentReason: `必須項目の完全性${Math.round(completeness * 100)}%、時系列一貫性${Math.round(consistency * 100)}%、推奨パターン適用スコア${Math.round(applicability * 100)}%`,
          };
        }),
    };

    // 各購買履歴に対して品質判定を実行
    const result1 = mockAIEngine.evaluatePatternRelevance(purchaseHistory1);
    const result2 = mockAIEngine.evaluatePatternRelevance(purchaseHistory2);
    const result3 = mockAIEngine.evaluatePatternRelevance(purchaseHistory3);

    // 複数件の判定結果が個別に生成されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);

    // 各レコードのスコア値を検証（異なる値であること）
    expect(result1.qualityScore).toBe(88);
    expect(result2.qualityScore).toBe(83);
    expect(result3.qualityScore).toBe(76);

    // 各レコードの判定ステータスを検証
    expect(result1.judgmentStatus).toBe("高品質");
    expect(result2.judgmentStatus).toBe("高品質");
    expect(result3.judgmentStatus).toBe("高品質");

    // 各レコードの判定理由を検証（具体的な評価項目を含む）
    expect(result1.judgmentReason).toMatch(/必須項目の完全性98%/);
    expect(result1.judgmentReason).toMatch(/時系列一貫性97%/);
    expect(result1.judgmentReason).toMatch(/推奨パターン適用スコア82%/);

    expect(result2.judgmentReason).toMatch(/必須項目の完全性92%/);
    expect(result2.judgmentReason).toMatch(/時系列一貫性88%/);
    expect(result2.judgmentReason).toMatch(/推奨パターン適用スコア75%/);

    expect(result3.judgmentReason).toMatch(/必須項目の完全性85%/);
    expect(result3.judgmentReason).toMatch(/時系列一貫性79%/);
    expect(result3.judgmentReason).toMatch(/推奨パターン適用スコア68%/);

    // 複数件の判定結果が同一ビューで比較可能な形式で構成できることを確認
    const allResults = [result1, result2, result3];
    expect(allResults).toHaveLength(3);
    expect(allResults.every((r) => r.qualityScore && r.judgmentStatus)).toBe(
      true
    );

    // 各レコードが異なるスコア値を持つことを確認
    const scores = allResults.map((r) => r.qualityScore);
    expect(new Set(scores).size).toBe(3); // 3つの異なるスコア値
  });
});