import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-1784: [normal] 推奨根拠の可視化機能 - 顧客条件マスタの制約条件が根拠として反映される", async () => {
    // テスト対象: 顧客条件マスタの制約条件を根拠として反映する機能
    const { visualizeRecommendationReasoning } = await import(
      "../../src/logic/it-1-br-3-1-1-1"
    );

    // テスト用スタブの定義
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec-001",
        proposedApproach: "提案アプローチ1",
        confidenceScore: 85,
        constraintsBasis: {
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 5000000,
        },
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning:
          "顧客は製造業で100-500名規模、予算上限500万円。過去の成功パターンマッチ度は82%。",
        matchingSuccessPatternsCount: 12,
        constraintMatchScore: 0.82,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    // 入力パラメータの構成
    const recommendationData = {
      recommendationId: "rec-001",
      customerId: "cust-2024-001",
      constraintConditions: {
        industry: "製造業",
        employeeRange: "100-500",
        budgetLimit: 5000000,
      },
      pastSuccessPatterns: [
        {
          patternId: "pat-001",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 5000000,
          matchScore: 0.85,
        },
        {
          patternId: "pat-002",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 5000000,
          matchScore: 0.79,
        },
        {
          patternId: "pat-003",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 4500000,
          matchScore: 0.82,
        },
        {
          patternId: "pat-004",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 5500000,
          matchScore: 0.80,
        },
        {
          patternId: "pat-005",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 5200000,
          matchScore: 0.81,
        },
        {
          patternId: "pat-006",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 4800000,
          matchScore: 0.83,
        },
        {
          patternId: "pat-007",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 5100000,
          matchScore: 0.78,
        },
        {
          patternId: "pat-008",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 4900000,
          matchScore: 0.84,
        },
        {
          patternId: "pat-009",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 5300000,
          matchScore: 0.77,
        },
        {
          patternId: "pat-010",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 5000000,
          matchScore: 0.86,
        },
        {
          patternId: "pat-011",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 4700000,
          matchScore: 0.81,
        },
        {
          patternId: "pat-012",
          industry: "製造業",
          employeeRange: "100-500",
          budgetLimit: 5400000,
          matchScore: 0.79,
        },
      ],
    };

    // 推奨根拠可視化関数を呼び出し
    const reasoningVisualization = await visualizeRecommendationReasoning(
      recommendationData,
      mockAIRecommendationEngine
    );

    // 期待結果の検証
    // 1. 推奨根拠可視化画面に制約条件が明示的に表示されている
    expect(reasoningVisualization).toBeDefined();
    expect(reasoningVisualization.appliedConstraints).toEqual({
      industry: "製造業",
      employeeRange: "100-500",
      budgetLimit: 5000000,
    });

    // 2. 各制約条件の横に過去成功パターンの件数が併記されている
    expect(reasoningVisualization.constraintBasis).toHaveLength(3);

    const industryConstraint = reasoningVisualization.constraintBasis.find(
      (c: any) => c.constraintType === "industry"
    );
    expect(industryConstraint).toEqual({
      constraintType: "industry",
      constraintValue: "製造業",
      matchingSuccessPatternsCount: 12,
      matchDegreeScore: 0.82,
    });

    const employeeRangeConstraint = reasoningVisualization.constraintBasis.find(
      (c: any) => c.constraintType === "employeeRange"
    );
    expect(employeeRangeConstraint).toEqual({
      constraintType: "employeeRange",
      constraintValue: "100-500",
      matchingSuccessPatternsCount: 12,
      matchDegreeScore: 0.82,
    });

    const budgetConstraint = reasoningVisualization.constraintBasis.find(
      (c: any) => c.constraintType === "budgetLimit"
    );
    expect(budgetConstraint).toEqual({
      constraintType: "budgetLimit",
      constraintValue: 5000000,
      matchingSuccessPatternsCount: 12,
      matchDegreeScore: 0.82,
    });

    // 3. explainRecommendationReasoningメソッドが呼び出されたことを確認
    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: "rec-001",
      })
    );

    // 4. 推奨根拠の説明文が自然言語で提示されている
    expect(reasoningVisualization.reasoning).toContain("製造業");
    expect(reasoningVisualization.reasoning).toContain("100");
    expect(reasoningVisualization.reasoning).toContain("500");
    expect(reasoningVisualization.reasoning).toContain("500万");

    // 5. マッチ度スコアが0～100の範囲で数値化されている
    expect(reasoningVisualization.overallMatchScore).toBeGreaterThanOrEqual(0);
    expect(reasoningVisualization.overallMatchScore).toBeLessThanOrEqual(100);
    expect(reasoningVisualization.overallMatchScore).toBe(82);
  });
});