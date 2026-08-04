import { generateProposalFeasibilityJudgment } from "../../src/logic/it-1-br-3-1-1-1";

describe("提案妥当性判定機能 - AIエージェント推奨根拠の可視化", () => {
  test("SCEN-1189: リスク要因が0件の場合に妥当性判定が実行される", () => {
    // Arrange: リスク要因が空配列の商談条件を構成
    const dealCondition = {
      dealId: "DEAL-2024-001",
      customerId: "CUST-001",
      industry: "製造業",
      companySize: "大規模企業",
      budget: 5000000,
      proposedProducts: ["商品A", "商品B"],
      riskFactors: [], // リスク要因: 0件
      customerConstraints: {
        budgetLimit: 6000000,
        purchaseSchedule: "Q2 2024",
        allowedProductCategories: ["カテゴリA", "カテゴリB"]
      },
      salesApproach: "顧客ニーズ合致型提案",
      proposedValue: 4500000,
      expectedROI: 35
    };

    // AIRecommendationEngineのスタブを作成
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "REC-2024-001",
        proposalApproach: "フェーズ型導入提案",
        confidenceScore: 85,
        successPatternMatches: [
          {
            patternId: "PAT-001",
            matchDegree: 0.92,
            successRate: 0.88
          }
        ],
        reasoning: "顧客の業種規模と予算がマッチングし、過去の類似案件で88%の成功率を記録している提案アプローチです。",
        evidence: {
          similarCases: 12,
          avgContractAmount: 4200000,
          avgSalesycles: 45
        }
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // Act: 提案妥当性判定関数を実行
    const result = generateProposalFeasibilityJudgment(dealCondition, aiEngineStub);

    // Assert: AIRecommendationEngineのgenerateRecommendationメソッドが呼び出されたことを検証
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: "DEAL-2024-001",
        riskFactors: []
      })
    );

    // Assert: 妥当性判定結果の構造と値を検証
    expect(result).toEqual(
      expect.objectContaining({
        judgmentStatus: "適格",
        feasibilityScore: 85,
        recommendationContent: {
          proposalApproach: "フェーズ型導入提案",
          confidenceScore: 85
        },
        recommendationReasoning: "顧客の業種規模と予算がマッチングし、過去の類似案件で88%の成功率を記録している提案アプローチです。",
        evidenceData: {
          similarCases: 12,
          successRate: 0.88,
          avgContractAmount: 4200000
        }
      })
    );

    // Assert: 判定ステータスが『適格』であることを確認
    expect(result.judgmentStatus).toBe("適格");

    // Assert: リスク要因が0件のため、減点要因がないことを確認（スコアが基本値を保持）
    expect(result.feasibilityScore).toBe(85);

    // Assert: 推奨内容と根拠が含まれていることを確認
    expect(result.recommendationContent).toBeDefined();
    expect(result.recommendationReasoning).toBeDefined();
    expect(result.recommendationReasoning).toMatch(/成功率/);

    // Assert: 生成タイムスタンプが存在することを確認
    expect(result.generatedAt).toBeDefined();
    expect(typeof result.generatedAt).toBe("string");

    // Assert: 妥当性判定結果オブジェクトが必須フィールドを含むことを確認
    expect(result).toHaveProperty("judgmentStatus");
    expect(result).toHaveProperty("feasibilityScore");
    expect(result).toHaveProperty("recommendationContent");
    expect(result).toHaveProperty("recommendationReasoning");
    expect(result).toHaveProperty("generatedAt");
  });
});