import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2611: 成功パターンの失敗要因が言語化された状態で存在する場合、その要因が根拠説明に回避策として含まれる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn((dealData, successPatterns) => {
        return {
          recommendationReason: 'クラウド導入により運用効率化と初期投資削減が見込める中堅企業向けの標準提案パターンです',
          avoidanceStrategy: '運用教育を導入前3ヶ月から段階的に実施し、ユーザー採用率を事前に80%以上確保することで、導入初期の運用教育不足によるユーザー採用遅延リスクを低減できます',
          explanation: '推奨理由：クラウド導入により運用効率化と初期投資削減が見込める中堅企業向けの標準提案パターンです ｜ 回避策：運用教育を導入前3ヶ月から段階的に実施し、ユーザー採用率を事前に80%以上確保することで、導入初期の運用教育不足によるユーザー採用遅延リスクを低減できます'
        };
      }),
      evaluatePatternRelevance: jest.fn()
    };

    const successPatternWithFailureFactor = {
      pattern_id: 'pat_001',
      customer_scale: 'mid_enterprise',
      industry: 'manufacturing',
      proposal_content: 'cloud_adoption',
      success_rate: 0.78,
      failure_factors: [
        {
          factor_id: 'ff_001',
          description: '導入初期の運用教育不足により、ユーザー採用が遅れるリスク',
          avoidance_measure: '運用教育を導入前3ヶ月から段階的に実施し、ユーザー採用率を事前に80%以上確保することで、導入初期の運用教育不足によるユーザー採用遅延リスクを低減できます'
        }
      ]
    };

    const newDealData = {
      deal_id: 'deal_2611_001',
      customer_scale: 'mid_enterprise',
      industry: 'manufacturing',
      budget: 50000000,
      proposal_type: 'cloud_adoption'
    };

    const result = explainRecommendationReasoning(
      newDealData,
      [successPatternWithFailureFactor],
      mockAIEngine
    );

    expect(result.explanation).toContain('推奨理由：');
    expect(result.explanation).toContain('回避策：');
    expect(result.explanation).toContain('運用教育を導入前3ヶ月から段階的に実施し');
    expect(result.explanation).toContain('ユーザー採用率を事前に80%以上確保することで');
    expect(result.explanation).toContain('導入初期の運用教育不足によるユーザー採用遅延リスク');
    expect(result.avoidanceStrategy).toBeDefined();
    expect(result.avoidanceStrategy.length).toBeGreaterThan(0);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      newDealData,
      [successPatternWithFailureFactor]
    );
  });
});