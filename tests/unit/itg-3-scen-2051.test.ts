import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2051
  test('適合性スコア0.76（推奨閾値直上）の場合、推奨アプローチと根拠を含む推奨結果が返される', async () => {
    const newDealData = {
      customerSize: '中堅企業',
      industry: '製造業',
      challenge: '生産効率化',
      budget: 5000000,
    };

    const mockSimilarPattern = {
      pastDealId: 'DEAL-2024-001',
      proposalApproach: '生産プロセス自動化ソリューション導入',
      relevanceScore: 0.76,
      successRate: 0.82,
      pastCustomerSize: '中堅企業',
      pastIndustry: '製造業',
      pastChallenge: '生産効率化',
    };

    const mockRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.76),
      findSimilarPatterns: jest
        .fn()
        .mockResolvedValue([mockSimilarPattern]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach:
          '生産プロセス自動化ソリューション導入による効率改善',
        relevanceScore: 0.76,
        isRecommended: true,
        reasoning:
          '過去の中堅製造業における生産効率化案件で0.82の成功率を達成。現案件の顧客属性・課題が0.76の高い適合度を示しており、同様のアプローチを推奨します。',
        supportingEvidence: [
          {
            pastDealId: 'DEAL-2024-001',
            successIndicator: '導入6ヶ月後に生産効率25%向上を実現',
          },
        ],
      }),
    };

    const result = await generateRecommendation(
      newDealData,
      mockRecommendationEngine
    );

    expect(result.recommendedApproach).toBeDefined();
    expect(result.recommendedApproach).not.toBeNull();
    expect(result.recommendedApproach).not.toBe('');

    expect(result.relevanceScore).toBe(0.76);

    expect(result.isRecommended).toBe(true);

    expect(result.reasoning).toBeDefined();
    expect(result.reasoning).not.toBe('');
  });
});