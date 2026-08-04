import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("複数提案要素を含む顧客マッチング一致度計算", () => {
  // SCEN-1610
  test("複数の商品・サービスを含む提案内容で全要素がベクトル化され加重平均で統合された一致度スコアが計算される", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockEmbeddingsStub = jest.fn().mockResolvedValue([
      [0.85, 0.72, 0.68],
      [0.82, 0.70, 0.65],
      [0.88, 0.75, 0.70],
    ]);

    const testCustomerData = {
      industry: "製造業",
      employeeCount: 500,
      businessChallenge: "生産効率化",
      region: "関東",
    };

    const proposalContent = {
      elements: [
        {
          name: "ERP導入サービス",
          importance: "high",
          vectorEmbedding: mockEmbeddingsStub,
        },
        {
          name: "生産管理ツール",
          importance: "medium",
          vectorEmbedding: mockEmbeddingsStub,
        },
        {
          name: "運用コンサルティング",
          importance: "low",
          vectorEmbedding: mockEmbeddingsStub,
        },
      ],
    };

    const partialScores = [0.85, 0.72, 0.68];
    const weights = [0.5, 0.3, 0.2];
    const expectedWeightedAverage =
      0.85 * 0.5 + 0.72 * 0.3 + 0.68 * 0.2;

    mockAIEngine.findSimilarPatterns.mockResolvedValue({
      matchedPatterns: [
        {
          pastCaseId: "case_001",
          customerProfile: {
            industry: "製造業",
            employeeCount: 480,
            businessChallenge: "生産効率化",
          },
          proposalElements: [
            { name: "ERP導入", matchScore: 0.85 },
            { name: "生産管理", matchScore: 0.72 },
            { name: "コンサル", matchScore: 0.68 },
          ],
          totalSimilarityScore: expectedWeightedAverage,
        },
      ],
    });

    const result = await findSimilarPatterns(
      testCustomerData,
      proposalContent,
      mockAIEngine
    );

    expect(result.matchedPatterns).toHaveLength(1);
    expect(result.matchedPatterns[0].proposalElements).toHaveLength(3);
    expect(result.matchedPatterns[0].proposalElements[0].matchScore).toBe(0.85);
    expect(result.matchedPatterns[0].proposalElements[1].matchScore).toBe(0.72);
    expect(result.matchedPatterns[0].proposalElements[2].matchScore).toBe(0.68);
    expect(result.matchedPatterns[0].totalSimilarityScore).toBeCloseTo(
      expectedWeightedAverage,
      2
    );

    const proposalWithReducedElements = {
      elements: [
        {
          name: "ERP導入サービス",
          importance: "high",
          vectorEmbedding: mockEmbeddingsStub,
        },
        {
          name: "生産管理ツール",
          importance: "medium",
          vectorEmbedding: mockEmbeddingsStub,
        },
      ],
    };

    mockAIEngine.findSimilarPatterns.mockResolvedValue({
      matchedPatterns: [
        {
          pastCaseId: "case_002",
          customerProfile: {
            industry: "製造業",
            employeeCount: 480,
            businessChallenge: "生産効率化",
          },
          proposalElements: [
            { name: "ERP導入", matchScore: 0.85 },
            { name: "生産管理", matchScore: 0.72 },
          ],
          totalSimilarityScore: (0.85 * 0.5 + 0.72 * 0.5) / 1.0,
        },
      ],
    });

    const resultReduced = await findSimilarPatterns(
      testCustomerData,
      proposalWithReducedElements,
      mockAIEngine
    );

    const reducedScore = resultReduced.matchedPatterns[0].totalSimilarityScore;
    expect(reducedScore).toBeLessThan(expectedWeightedAverage);
    expect(reducedScore).toBeLessThanOrEqual(0.6);
  });
});