import { evaluateProposalAgainstConstraints } from "../../src/logic/it-1-br-3-1-1-1";
import { AIRecommendationEngine } from "../../src/external/AIRecommendationEngine";

describe("提案内容と顧客制約条件の自動照合機能", () => {
  // SCEN-1319
  test("提案内容データが複数件のとき、すべての提案に対して照合が実行される", () => {
    const proposalData = [
      {
        proposalId: "PROP-001",
        proposalName: "導入コスト削減プラン",
        estimatedCost: 4500000,
        implementationDays: 90,
        requiresLegacyIntegration: true,
        dataCenter: "tokyo",
      },
      {
        proposalId: "PROP-002",
        proposalName: "運用効率化プラン",
        estimatedCost: 3000000,
        implementationDays: 60,
        requiresLegacyIntegration: false,
        dataCenter: "tokyo",
      },
      {
        proposalId: "PROP-003",
        proposalName: "セキュリティ強化プラン",
        estimatedCost: 5500000,
        implementationDays: 120,
        requiresLegacyIntegration: true,
        dataCenter: "tokyo",
      },
    ];

    const customerConstraints = [
      {
        constraintId: "CONSTRAINT-001",
        type: "budget",
        value: 5000000,
        description: "予算上限500万円",
      },
      {
        constraintId: "CONSTRAINT-002",
        type: "implementationPeriod",
        value: 90,
        description: "実装期間3ヶ月以内",
      },
      {
        constraintId: "CONSTRAINT-003",
        type: "legacyIntegration",
        value: true,
        description: "レガシーシステム連携必須",
      },
      {
        constraintId: "CONSTRAINT-004",
        type: "dataCenter",
        value: "tokyo",
        description: "データセンター東京リージョン限定",
      },
    ];

    const callHistory: Array<{
      proposalId: string;
      constraints: typeof customerConstraints;
    }> = [];

    const mockAIEngine: AIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(
        (proposalId: string, constraints: typeof customerConstraints) => {
          callHistory.push({
            proposalId,
            constraints,
          });

          const relevanceScores: Record<string, number> = {
            "PROP-001": 85,
            "PROP-002": 92,
            "PROP-003": 72,
          };

          return {
            relevanceScore: relevanceScores[proposalId] || 0,
            applicability: relevanceScores[proposalId]! >= 80,
          };
        }
      ),
    };

    const result = evaluateProposalAgainstConstraints(
      proposalData,
      customerConstraints,
      mockAIEngine
    );

    expect(callHistory).toHaveLength(3);
    expect(callHistory[0]).toEqual({
      proposalId: "PROP-001",
      constraints: customerConstraints,
    });
    expect(callHistory[1]).toEqual({
      proposalId: "PROP-002",
      constraints: customerConstraints,
    });
    expect(callHistory[2]).toEqual({
      proposalId: "PROP-003",
      constraints: customerConstraints,
    });

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      proposalId: "PROP-001",
      relevanceScore: 85,
      isApplicable: true,
      constraintViolationFlags: [],
      evaluationTimestamp: expect.any(String),
    });

    expect(result[1]).toEqual({
      proposalId: "PROP-002",
      relevanceScore: 92,
      isApplicable: true,
      constraintViolationFlags: [],
      evaluationTimestamp: expect.any(String),
    });

    expect(result[2]).toEqual({
      proposalId: "PROP-003",
      relevanceScore: 72,
      isApplicable: false,
      constraintViolationFlags: [
        {
          constraintId: "CONSTRAINT-002",
          description: "実装期間3ヶ月以内",
          reason: "提案実装期間120日が90日以内の制約を超過",
        },
        {
          constraintId: "CONSTRAINT-001",
          description: "予算上限500万円",
          reason: "提案コスト550万円が500万円の予算上限を超過",
        },
      ],
      evaluationTimestamp: expect.any(String),
    });

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      "PROP-001",
      customerConstraints
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      "PROP-002",
      customerConstraints
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      "PROP-003",
      customerConstraints
    );
  });
});