import { extractRecommendationReasons } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1916: 推奨根拠の可視化機能 - 過去事例の日付が年度をまたぐときに期間内の根拠が正しく抽出される", () => {
    // テストデータ準備：過去事例
    const pastExample_A = {
      exampleId: "EX-001",
      exampleDate: "2024-03-15",
      customerIndustry: "製造業",
      dealAmount: 5000000,
      successFactors: ["顧客課題の深掘り", "経営層への提案"],
    };

    const pastExample_B = {
      exampleId: "EX-002",
      exampleDate: "2024-04-10",
      customerIndustry: "流通業",
      dealAmount: 3000000,
      successFactors: ["迅速な対応", "柔軟な条件提示"],
    };

    const pastExample_C = {
      exampleId: "EX-003",
      exampleDate: "2025-03-20",
      customerIndustry: "サービス業",
      dealAmount: 2000000,
      successFactors: ["長期的なパートナーシップ", "付加価値提案"],
    };

    // AIRecommendationEngine のスタブ化
    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      pastExample_A,
      pastExample_B,
      pastExample_C,
    ]);

    const mockExplainRecommendationReasoning = jest
      .fn()
      .mockImplementation((example) => {
        if (example.exampleId === "EX-001") {
          return `2024年3月15日の案件において、顧客課題の深掘りと経営層への提案により成功しました。`;
        } else if (example.exampleId === "EX-002") {
          return `2024年4月10日の案件において、迅速な対応と柔軟な条件提示により成功しました。`;
        } else if (example.exampleId === "EX-003") {
          return `2025年3月20日の案件において、長期的なパートナーシップと付加価値提案により成功しました。`;
        }
        return "";
      });

    const mockAIEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
    };

    // 新規案件データ
    const newDeal = {
      dealDate: "2024-10-01",
      customerIndustry: "製造業",
      dealAmount: 4500000,
      targetPeriodStart: "2023-04-01",
      targetPeriodEnd: "2024-03-31",
    };

    // 推奨根拠の可視化機能を実行
    const result = extractRecommendationReasons(newDeal, mockAIEngine);

    // 戻り値の検証
    expect(result.extractedReasons).toHaveLength(1);

    const extractedExample = result.extractedReasons[0];
    expect(extractedExample.exampleId).toBe("EX-001");
    expect(extractedExample.exampleDate).toBe("2024-03-15");
    expect(extractedExample.reasoningExplanation).toContain("2024年3月15日");
    expect(extractedExample.reasoningExplanation).toContain(
      "顧客課題の深掘り"
    );

    // 除外された事例の確認
    const excludedExampleIds = result.excludedReasons.map(
      (r) => r.exampleId
    );
    expect(excludedExampleIds).toContain("EX-002");
    expect(excludedExampleIds).toContain("EX-003");

    // 期間外の理由を確認
    const reasonB = result.excludedReasons.find((r) => r.exampleId === "EX-002");
    expect(reasonB.exclusionReason).toBe("outside_target_period");

    const reasonC = result.excludedReasons.find((r) => r.exampleId === "EX-003");
    expect(reasonC.exclusionReason).toBe("outside_target_period");

    // フィルタリング統計情報
    expect(result.filteringStatistics.totalExamples).toBe(3);
    expect(result.filteringStatistics.extractedCount).toBe(1);
    expect(result.filteringStatistics.excludedCount).toBe(2);
  });
});