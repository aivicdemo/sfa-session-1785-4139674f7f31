import { displayRecommendationRationale } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-889: 推奨根拠データの提示機能 - 類似度スコアが降順で根拠データが並ぶとき同じ順序で提示される", () => {
    const similarPatternsStub = [
      {
        patternId: "pattern_001",
        score: 0.95,
        customerIndustry: "製造業",
        dealStage: "提案段階",
        successFactor: "顧客のコスト削減要望に対する削減シミュレーション提示",
        pastDealId: "deal_2024_001",
      },
      {
        patternId: "pattern_002",
        score: 0.87,
        customerIndustry: "流通業",
        dealStage: "提案段階",
        successFactor: "業務効率化のKPI設定と改善ロードマップ提示",
        pastDealId: "deal_2024_015",
      },
      {
        patternId: "pattern_003",
        score: 0.76,
        customerIndustry: "金融業",
        dealStage: "初期接触",
        successFactor: "規制対応と競争力向上の両立戦略の説明",
        pastDealId: "deal_2024_032",
      },
    ];

    const recommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest
        .fn()
        .mockReturnValue(Promise.resolve(similarPatternsStub)),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationContent = {
      recommendationId: "rec_889",
      proposalApproach: "顧客のビジネス課題に基づいたカスタマイズ提案",
      estimatedSuccessProbability: 0.88,
      recommendedActions: [
        "初回会議で顧客のコスト構造をヒアリング",
        "削減シミュレーションを3日以内に提示",
        "経営層向けの投資対効果資料を準備",
      ],
    };

    const inputCondition = {
      currentDealId: "deal_current_889",
      customerIndustry: "製造業",
      dealAmount: 5000000,
      dealStage: "提案準備",
    };

    const result = displayRecommendationRationale(
      recommendationContent,
      inputCondition,
      recommendationEngineStub
    );

    expect(result.recommendationId).toBe("rec_889");
    expect(result.rationales).toHaveLength(3);

    expect(result.rationales[0].score).toBe(0.95);
    expect(result.rationales[0].patternId).toBe("pattern_001");
    expect(result.rationales[0].customerIndustry).toBe("製造業");
    expect(result.rationales[0].successFactor).toBe(
      "顧客のコスト削減要望に対する削減シミュレーション提示"
    );

    expect(result.rationales[1].score).toBe(0.87);
    expect(result.rationales[1].patternId).toBe("pattern_002");
    expect(result.rationales[1].customerIndustry).toBe("流通業");
    expect(result.rationales[1].successFactor).toBe(
      "業務効率化のKPI設定と改善ロードマップ提示"
    );

    expect(result.rationales[2].score).toBe(0.76);
    expect(result.rationales[2].patternId).toBe("pattern_003");
    expect(result.rationales[2].customerIndustry).toBe("金融業");
    expect(result.rationales[2].successFactor).toBe(
      "規制対応と競争力向上の両立戦略の説明"
    );

    expect(recommendationEngineStub.findSimilarPatterns).toHaveBeenCalledWith({
      customerIndustry: "製造業",
      dealAmount: 5000000,
      dealStage: "提案準備",
    });
  });
});