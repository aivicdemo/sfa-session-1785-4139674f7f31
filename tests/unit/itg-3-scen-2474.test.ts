import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチの自動推奨機能', () => {
  // SCEN-2474
  test('新規案件が成功パターンと複数件マッチするとき、マッチ度の高い順に提案アプローチが推奨される', () => {
    const newDealCustomerInfo = {
      industry: 'IT',
      companySize: '中堅',
      businessChallenge: 'デジタル化推進'
    };

    const newDealConditions = {
      dealValue: 5000000,
      dealStage: '提案段階',
      customerNeedType: 'デジタルトランスフォーメーション'
    };

    const mockSimilarPatterns = [
      {
        patternId: 'pattern_A',
        matchScore: 0.92,
        proposalApproach: 'DX推進プログラム（3年型）',
        successProbability: 0.88
      },
      {
        patternId: 'pattern_B',
        matchScore: 0.78,
        proposalApproach: 'クラウド導入支援サービス',
        successProbability: 0.72
      },
      {
        patternId: 'pattern_C',
        matchScore: 0.85,
        proposalApproach: 'データ活用基盤構築',
        successProbability: 0.81
      }
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproaches: [
          {
            rank: 1,
            patternId: 'pattern_A',
            proposalApproach: 'DX推進プログラム（3年型）',
            matchScore: 0.92,
            reasoning: 'IT業界の中堅企業向けDX推進の実績が最高'
          },
          {
            rank: 2,
            patternId: 'pattern_C',
            proposalApproach: 'データ活用基盤構築',
            matchScore: 0.85,
            reasoning: 'デジタル化推進ニーズに高度に適合'
          },
          {
            rank: 3,
            patternId: 'pattern_B',
            proposalApproach: 'クラウド導入支援サービス',
            matchScore: 0.78,
            reasoning: '基盤構築のベースとして選択肢あり'
          }
        ],
        overallConfidenceScore: 87
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    return generateRecommendation(
      newDealCustomerInfo,
      newDealConditions,
      mockAIEngine
    ).then((result) => {
      expect(result.recommendedApproaches).toHaveLength(3);

      expect(result.recommendedApproaches[0].rank).toBe(1);
      expect(result.recommendedApproaches[0].patternId).toBe('pattern_A');
      expect(result.recommendedApproaches[0].proposalApproach).toBe('DX推進プログラム（3年型）');
      expect(result.recommendedApproaches[0].matchScore).toBe(0.92);

      expect(result.recommendedApproaches[1].rank).toBe(2);
      expect(result.recommendedApproaches[1].patternId).toBe('pattern_C');
      expect(result.recommendedApproaches[1].proposalApproach).toBe('データ活用基盤構築');
      expect(result.recommendedApproaches[1].matchScore).toBe(0.85);

      expect(result.recommendedApproaches[2].rank).toBe(3);
      expect(result.recommendedApproaches[2].patternId).toBe('pattern_B');
      expect(result.recommendedApproaches[2].proposalApproach).toBe('クラウド導入支援サービス');
      expect(result.recommendedApproaches[2].matchScore).toBe(0.78);

      expect(result.overallConfidenceScore).toBe(87);
    });
  });
});