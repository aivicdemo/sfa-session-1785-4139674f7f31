import { jest } from "@jest/globals";
import { evaluateRecommendationAccuracy } from "../../src/logic/it-1-br-3-1-1-1";

// Mock type definitions for AIRecommendationEngine
interface RecommendationResult {
  recommendationId: string;
  similarityScore: number;
  proposedApproach: string;
}

interface AccuracyEvaluationResult {
  exactMatchCount: number;
  partialMatchCount: number;
  noMatchCount: number;
  totalCount: number;
}

describe("AIエージェント推奨根拠の可視化 - 推論精度検証", () => {
  // SCEN-401
  test("複数の一致レベル（完全一致・部分一致・不一致）が混在するとき、各レベルを区分して集計", () => {
    // Arrange: AIRecommendationEngine のスタブを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    // テストデータセット: 複数の過去成功パターン
    // - 完全一致（similarityScore >= 0.95）: 5件
    // - 部分一致（0.60 <= similarityScore < 0.95）: 3件
    // - 不一致（similarityScore < 0.60）: 2件
    const pastSuccessPatterns: RecommendationResult[] = [
      {
        recommendationId: "exact_1",
        similarityScore: 0.98,
        proposedApproach: "Approach A",
      },
      {
        recommendationId: "exact_2",
        similarityScore: 0.96,
        proposedApproach: "Approach B",
      },
      {
        recommendationId: "exact_3",
        similarityScore: 0.97,
        proposedApproach: "Approach C",
      },
      {
        recommendationId: "exact_4",
        similarityScore: 0.95,
        proposedApproach: "Approach D",
      },
      {
        recommendationId: "exact_5",
        similarityScore: 0.99,
        proposedApproach: "Approach E",
      },
      {
        recommendationId: "partial_1",
        similarityScore: 0.85,
        proposedApproach: "Approach F",
      },
      {
        recommendationId: "partial_2",
        similarityScore: 0.72,
        proposedApproach: "Approach G",
      },
      {
        recommendationId: "partial_3",
        similarityScore: 0.68,
        proposedApproach: "Approach H",
      },
      {
        recommendationId: "nomatch_1",
        similarityScore: 0.45,
        proposedApproach: "Approach I",
      },
      {
        recommendationId: "nomatch_2",
        similarityScore: 0.30,
        proposedApproach: "Approach J",
      },
    ];

    // 顧客条件・商談データ
    const customerCondition = {
      customerId: "CUST_001",
      industry: "Technology",
      companySize: "Enterprise",
      dealValue: 500000,
    };

    // Act: 推論精度検証機能を実行
    const result: AccuracyEvaluationResult = evaluateRecommendationAccuracy(
      pastSuccessPatterns,
      customerCondition,
      mockAIEngine
    );

    // Assert: 集計結果を検証
    // 完全一致 = 5件
    expect(result.exactMatchCount).toBe(5);
    // 部分一致 = 3件
    expect(result.partialMatchCount).toBe(3);
    // 不一致 = 2件
    expect(result.noMatchCount).toBe(2);
    // 合計 = 10件
    expect(result.totalCount).toBe(10);

    // 各集計カウンタの合計が入力データ件数と一致することを確認
    expect(
      result.exactMatchCount + result.partialMatchCount + result.noMatchCount
    ).toBe(pastSuccessPatterns.length);
  });
});