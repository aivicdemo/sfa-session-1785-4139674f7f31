import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  let aiRecommendationEngineStub: any;

  beforeEach(() => {
    aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('SCEN-1623: 推奨内容の根拠表示 - 根拠データが1件のとき、その1件の根拠が表示される', () => {
    const customerCondition = {
      customerId: 'CUST-001',
      industry: '製造業',
      companySize: '中堅企業',
      currentChallenge: '生産効率化',
    };

    const dealCondition = {
      dealId: 'DEAL-001',
      stage: '提案準備',
      productCategory: 'ERP',
      proposedBudget: 5000000,
    };

    const similarPatternsResponse = [
      {
        pastDealId: 'PAST-DEAL-123',
        similarityScore: 0.87,
        customerId: 'CUST-999',
        industry: '製造業',
        companySize: '中堅企業',
        dealAmount: 4800000,
        contractDate: '2023-06-15',
      },
    ];

    const explanationText =
      '過去案件PAST-DEAL-123では、同じく製造業の中堅企業が類似の生産効率化課題を抱えており、ERP導入により25%の生産効率向上を実現しました。現在の案件も同様の効果が期待できます。';

    const recommendationResult = {
      recommendedApproach: '段階的なERP導入プロセス',
      confidenceScore: 0.87,
      rationale: {
        similarPatterns: similarPatternsResponse,
        explanation: explanationText,
      },
      successProbability: 0.85,
    };

    aiRecommendationEngineStub.findSimilarPatterns.mockReturnValue(
      similarPatternsResponse
    );
    aiRecommendationEngineStub.explainRecommendationReasoning.mockReturnValue(
      explanationText
    );
    aiRecommendationEngineStub.generateRecommendation.mockReturnValue(
      recommendationResult
    );

    const result = generateRecommendation(
      customerCondition,
      dealCondition,
      aiRecommendationEngineStub
    );

    expect(result).toBeDefined();
    expect(result.rationale).toBeDefined();
    expect(result.rationale.similarPatterns).toHaveLength(1);
    expect(result.rationale.similarPatterns[0]).toEqual({
      pastDealId: 'PAST-DEAL-123',
      similarityScore: 0.87,
      customerId: 'CUST-999',
      industry: '製造業',
      companySize: '中堅企業',
      dealAmount: 4800000,
      contractDate: '2023-06-15',
    });

    expect(result.rationale.explanation).toBe(
      '過去案件PAST-DEAL-123では、同じく製造業の中堅企業が類似の生産効率化課題を抱えており、ERP導入により25%の生産効率向上を実現しました。現在の案件も同様の効果が期待できます。'
    );

    expect(result.confidenceScore).toBe(0.87);

    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenCalledWith(
      customerCondition,
      dealCondition
    );

    expect(
      aiRecommendationEngineStub.explainRecommendationReasoning
    ).toHaveBeenCalledWith(similarPatternsResponse, recommendationResult);

    expect(
      aiRecommendationEngineStub.generateRecommendation
    ).toHaveBeenCalledWith(customerCondition, dealCondition);
  });
});