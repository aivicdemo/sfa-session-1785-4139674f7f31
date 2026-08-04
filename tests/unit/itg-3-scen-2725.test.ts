import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("顧客・商談条件の照合判定 - 成功パターンマッチングと提案アプローチ推奨", () => {
  test("SCEN-2725: 新規案件の商談条件が成功パターンの条件範囲内の場合、提案アプローチが推奨される", () => {
    // Arrange: 新規案件の商談条件を定義
    const newDealCondition = {
      industry: "製造業",
      dealAmount: 5000000, // 500万円
      stage: "提案前",
      customerEmployeeCount: 250, // 100～500名の範囲内
    };

    // 成功パターンマスタから抽出した過去事例の条件範囲
    const successPatternCriteria = {
      industryMatch: "製造業",
      dealAmountMin: 3000000,
      dealAmountMax: 8000000,
      stageMatch: "提案前",
      employeeCountMin: 100,
      employeeCountMax: 500,
    };

    // AIRecommendationEngineのスタブを定義
    const aiEngineStub = {
      matchScore: 0.85,
      recommendedApproach: "経営層向け価値提案",
      rationale:
        "入力された商談条件が過去成功事例の条件範囲（製造業・500万円前後・提案前段階・同規模顧客）に合致しており、マッチスコア0.85で高い適合度を示しています",
    };

    // Act: 評価関数を実行
    const evaluationResult = evaluatePatternRelevance(
      newDealCondition,
      successPatternCriteria,
      aiEngineStub
    );

    // Assert: 推奨が正しく返されることを検証
    expect(evaluationResult).toEqual({
      recommendedApproach: "経営層向け価値提案",
      matchScore: 0.85,
      rationale:
        "入力された商談条件が過去成功事例の条件範囲（製造業・500万円前後・提案前段階・同規模顧客）に合致しており、マッチスコア0.85で高い適合度を示しています",
      recommendationStatus: "適用推奨",
      isApplicable: true,
    });

    // マッチスコアが基準値（0.70）以上であることを検証
    expect(evaluationResult.matchScore).toBeGreaterThanOrEqual(0.7);

    // 推奨ステータスが「適用推奨」であることを検証
    expect(evaluationResult.recommendationStatus).toBe("適用推奨");

    // 推奨可能フラグがtrueであることを検証
    expect(evaluationResult.isApplicable).toBe(true);
  });
});