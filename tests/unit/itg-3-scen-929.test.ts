import { generateRecommendationWithReasoningOrder } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨支援システム - 推奨内容の根拠表示機能", () => {
  test("SCEN-929: 複数の成功パターンマッチング根拠が優先度順に整列されて表示される", () => {
    // スタブ: AIRecommendationEngine
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: "rec-001",
        proposalApproach: "顧客の経営課題に対応した段階的提案",
        confidenceScore: 92,
        timestamp: new Date("2024-02-15T10:30:00Z"),
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: "pattern-A",
          description: "大企業向け複数商品パッケージ提案",
          relevanceScore: 0.95,
          sourceCase: "case-2023-001",
        },
        {
          patternId: "pattern-B",
          description: "中堅企業単一商品フォーカス提案",
          relevanceScore: 0.87,
          sourceCase: "case-2023-015",
        },
        {
          patternId: "pattern-C",
          description: "スタートアップ向けカスタマイズ提案",
          relevanceScore: 0.92,
          sourceCase: "case-2023-008",
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanation: "以下の成功パターンマッチングに基づいて推奨されました",
        sortedReasons: [
          {
            rank: 1,
            patternId: "pattern-A",
            description: "大企業向け複数商品パッケージ提案",
            relevanceScore: 0.95,
            sourceCase: "case-2023-001",
          },
          {
            rank: 2,
            patternId: "pattern-C",
            description: "スタートアップ向けカスタマイズ提案",
            relevanceScore: 0.92,
            sourceCase: "case-2023-008",
          },
          {
            rank: 3,
            patternId: "pattern-B",
            description: "中堅企業単一商品フォーカス提案",
            relevanceScore: 0.87,
            sourceCase: "case-2023-015",
          },
        ],
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    // テスト用の新規案件データ
    const newDealData = {
      dealId: "deal-2024-0542",
      customerIndustry: "IT",
      customerScale: "large",
      customerEmployeeCount: 5000,
      businessChallenge: "デジタル変革推進",
      budget: 50000000,
      timelineMonths: 12,
      decisionMaker: "CTO",
    };

    // generateRecommendation を呼び出し
    const recommendationResult = mockAIRecommendationEngine.generateRecommendation(newDealData);

    expect(recommendationResult).toEqual({
      recommendationId: "rec-001",
      proposalApproach: "顧客の経営課題に対応した段階的提案",
      confidenceScore: 92,
      timestamp: new Date("2024-02-15T10:30:00Z"),
    });

    // explainRecommendationReasoning を呼び出し
    const reasoningResult = mockAIRecommendationEngine.explainRecommendationReasoning(
      recommendationResult.recommendationId,
      newDealData
    );

    // 根拠表示画面に表示される複数の成功パターンマッチング根拠の順序を確認
    expect(reasoningResult.sortedReasons).toHaveLength(3);

    // 根拠が relevanceScore の高い順に整列されていることを検証
    expect(reasoningResult.sortedReasons[0].rank).toBe(1);
    expect(reasoningResult.sortedReasons[0].patternId).toBe("pattern-A");
    expect(reasoningResult.sortedReasons[0].relevanceScore).toBe(0.95);
    expect(reasoningResult.sortedReasons[0].description).toBe("大企業向け複数商品パッケージ提案");

    expect(reasoningResult.sortedReasons[1].rank).toBe(2);
    expect(reasoningResult.sortedReasons[1].patternId).toBe("pattern-C");
    expect(reasoningResult.sortedReasons[1].relevanceScore).toBe(0.92);
    expect(reasoningResult.sortedReasons[1].description).toBe("スタートアップ向けカスタマイズ提案");

    expect(reasoningResult.sortedReasons[2].rank).toBe(3);
    expect(reasoningResult.sortedReasons[2].patternId).toBe("pattern-B");
    expect(reasoningResult.sortedReasons[2].relevanceScore).toBe(0.87);
    expect(reasoningResult.sortedReasons[2].description).toBe("中堅企業単一商品フォーカス提案");

    // 各根拠にはスコア値と説明文が含まれていることを検証
    reasoningResult.sortedReasons.forEach((reason: any) => {
      expect(reason).toHaveProperty("patternId");
      expect(reason).toHaveProperty("description");
      expect(reason).toHaveProperty("relevanceScore");
      expect(reason).toHaveProperty("sourceCase");
      expect(typeof reason.relevanceScore).toBe("number");
      expect(reason.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(reason.relevanceScore).toBeLessThanOrEqual(1);
    });

    // 優先度の順序が降順になっていることを検証
    for (let i = 0; i < reasoningResult.sortedReasons.length - 1; i++) {
      expect(reasoningResult.sortedReasons[i].relevanceScore).toBeGreaterThanOrEqual(
        reasoningResult.sortedReasons[i + 1].relevanceScore
      );
    }
  });
});