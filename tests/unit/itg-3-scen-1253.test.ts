import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1253: 営業プロセス遵守事項が0件のときに判定ロジックが適切に処理される", () => {
    // Arrange: AIRecommendationEngineのモック化
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // generateRecommendationの成功レスポンス
    mockAIEngine.generateRecommendation.mockResolvedValue({
      proposalApproach: "顧客のコスト削減を重視した提案アプローチ",
      successPatternId: "pattern_001",
      confidence: 0.92,
    });

    // evaluatePatternRelevanceのレスポンス
    mockAIEngine.evaluatePatternRelevance.mockResolvedValue({
      relevanceScore: 0.87,
      applicabilityFactors: [
        "顧客業種一致",
        "予算規模適合",
        "営業段階適合",
      ],
    });

    // explainRecommendationReasoningのレスポンス
    mockAIEngine.explainRecommendationReasoning.mockResolvedValue({
      reasoning:
        "過去事例より、同規模・同業種の顧客に対するコスト削減提案は78%の成約率を示しており、本案件条件と合致している。",
    });

    // 入力データ: 有効な新規案件データ（営業プロセス遵守事項参照件数=0）
    const proposalInput = {
      customerId: "cust_12345",
      customerName: "株式会社テスト",
      industry: "製造業",
      companySize: "中規模",
      businessChallenges: ["コスト削減", "業務効率化"],
      dealConditions: {
        dealStage: "初期接触",
        estimatedBudget: 5000000,
        decisionTimeframe: "3ヶ月以内",
      },
      businessProcessComplianceRequirements: [], // 0件
    };

    // Act: 提案妥当性判定機能を実行
    const result = evaluateProposalValidity(proposalInput, mockAIEngine);

    // Assert: 判定結果の検証
    expect(result).toBeDefined();
    expect(result.status).toBe("SUCCESS");
    expect(result.recommendation).toBeDefined();
    expect(result.recommendation.proposalApproach).toBe(
      "顧客のコスト削減を重視した提案アプローチ"
    );
    expect(result.recommendation.successPatternId).toBe("pattern_001");
    expect(result.recommendation.confidence).toBe(0.92);

    // 適用スコアが0.0～1.0の範囲内であることを確認
    expect(result.score).toBeGreaterThanOrEqual(0.0);
    expect(result.score).toBeLessThanOrEqual(1.0);
    expect(result.score).toBe(0.87);

    // 根拠説明文が正常に格納されていることを確認
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning).toBe(
      "過去事例より、同規模・同業種の顧客に対するコスト削減提案は78%の成約率を示しており、本案件条件と合致している。"
    );

    // 営業プロセス遵守事項が0件であることを確認
    expect(proposalInput.businessProcessComplianceRequirements.length).toBe(0);

    // AIエージェントのメソッドが呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      proposalInput
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});