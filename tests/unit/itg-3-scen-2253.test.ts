import { displayRecommendationDetails } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2253: 推奨内容表示機能 - 推奨された提案アプローチが営業担当者に表示される", () => {
    // スタブの AIRecommendationEngine
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: {
          proposalContent: "自動化ソリューション導入支援",
          proposalSequence: "現状分析→ROI試算→導入計画",
        },
        relevanceScore: 0.92,
        similarSuccessCases: {
          count: 3,
          industry: "製造業",
          companyScale: "中堅企業",
          successRate: 0.85,
        },
      }),
    };

    // 入力条件
    const recommendationData = {
      customerId: "CUST-001",
      dealId: "DEAL-202401-001",
      industry: "製造業",
      companyScale: "中堅企業",
      challenge: "生産効率化",
      recommendationId: "REC-20240115-001",
    };

    // 期待結果オブジェクト
    const expectedDisplay = {
      recommendedApproach: "自動化ソリューション導入支援",
      proposalSequence: "現状分析→ROI試算→導入計画",
      relevanceScorePercent: 92,
      similarCasesText: "過去3件の製造業中堅企業案件、成約率85%",
    };

    // displayRecommendationDetails を呼び出し
    const displayResult = displayRecommendationDetails(
      recommendationData,
      mockAIRecommendationEngine
    );

    // 推奨アプローチが表示されている
    expect(displayResult.recommendedApproach).toBe(
      expectedDisplay.recommendedApproach
    );

    // 提案順序が表示されている
    expect(displayResult.proposalSequence).toBe(
      expectedDisplay.proposalSequence
    );

    // 推奨根拠スコア「適合度92%」が表示されている
    expect(displayResult.relevanceScorePercent).toBe(
      expectedDisplay.relevanceScorePercent
    );

    // 類似成功事例情報が表示されている
    expect(displayResult.similarCasesText).toBe(
      expectedDisplay.similarCasesText
    );

    // AIRecommendationEngine が正しく呼び出されている
    expect(
      mockAIRecommendationEngine.generateRecommendation
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: "製造業",
        companyScale: "中堅企業",
        challenge: "生産効率化",
      })
    );
  });
});