import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-598: [normal] AIエージェント推奨根拠の可視化機能 - 過去成功パターンマッチング結果から推奨内容と根拠が生成される
  test('過去成功パターンマッチング結果から推奨内容と根拠が生成される', () => {
    const mock_AIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue({
        matchedPatterns: [
          {
            patternId: 'PAT-001',
            similarity: 0.92,
            industry: '製造業',
            dealSize: '500万円',
            proposalApproach: 'ROI重視型提案',
          },
          {
            patternId: 'PAT-002',
            similarity: 0.85,
            industry: '製造業',
            dealSize: '300万円',
            proposalApproach: '段階導入型提案',
          },
        ],
        topPattern: {
          patternId: 'PAT-001',
          similarity: 0.92,
        },
      }),
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationContent:
          '顧客の製造業背景とROI改善ニーズに基づき、まずは部分導入による効果可視化を推奨',
        matchedPatternId: 'PAT-001',
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoning:
          '過去92%の類似度で成功した製造業案件(PAT-001)で、同様のROI重視アプローチが採用されており、本案件の顧客属性と商談条件が一致しているため',
      }),
    };

    const input_newDealInfo = {
      customerId: 'CUST-123',
      industry: '製造業',
      dealSize: '450万円',
      customerChallenges: 'ROI改善',
      contactHistory: 'ヒアリング1回実施',
    };

    const result = generateRecommendationWithReasoning(
      input_newDealInfo,
      mock_AIRecommendationEngine
    );

    expect(result.recommendationContent).toBe(
      '顧客の製造業背景とROI改善ニーズに基づき、まずは部分導入による効果可視化を推奨'
    );
    expect(result.matchedPatternId).toBe('PAT-001');
    expect(result.confidenceScore).toBe(0.92);
    expect(result.reasoning).toBe(
      '過去92%の類似度で成功した製造業案件(PAT-001)で、同様のROI重視アプローチが採用されており、本案件の顧客属性と商談条件が一致しているため'
    );
    expect(result.sourcePatterns).toEqual([
      {
        patternId: 'PAT-001',
        similarity: 0.92,
        industry: '製造業',
        dealSize: '500万円',
        proposalApproach: 'ROI重視型提案',
      },
      {
        patternId: 'PAT-002',
        similarity: 0.85,
        industry: '製造業',
        dealSize: '300万円',
        proposalApproach: '段階導入型提案',
      },
    ]);
  });
});