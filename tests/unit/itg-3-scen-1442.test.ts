import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1442
  test('過去成功パターンのマスタデータが空のとき、代替動作が実行される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockInternalPatternMaster = [
      {
        pattern_id: 'pattern_001',
        name: '初期接触時の課題ヒアリング重視',
        success_rate: 0.82,
        description: '初回接触で顧客の経営課題を深掘りすることで成約率82%を実現',
        recommendation_text: '初期接触時の課題ヒアリング重視',
      },
      {
        pattern_id: 'pattern_002',
        name: '段階的な提案展開',
        success_rate: 0.75,
        description: '複数段階での提案展開パターン',
        recommendation_text: '段階的な提案展開',
      },
    ];

    const newDealData = {
      customer_name: 'テスト顧客A',
      deal_amount: 5000000,
      industry: '製造業',
      customer_id: 'cust_test_001',
      deal_stage: '初期接触',
    };

    const result = await generateRecommendation(
      newDealData,
      mockAIEngine,
      mockInternalPatternMaster
    );

    expect(result).toBeDefined();
    expect(result.status_code).toBe(200);
    expect(result.error_flag).toBe(false);
    expect(result.recommendation_pattern).toBeDefined();
    expect(result.recommendation_pattern.pattern_id).toBe('pattern_001');
    expect(result.recommendation_pattern.name).toBe('初期接触時の課題ヒアリング重視');
    expect(result.recommendation_pattern.success_rate).toBe(0.82);
    expect(result.briefing_explanation).toBeDefined();
    expect(result.briefing_explanation.length).toBeLessThanOrEqual(100);
    expect(result.briefing_explanation).toBe(
      '初回接触で顧客の経営課題を深掘りすることで成約率82%を実現'
    );
    expect(result.user_message).toBeUndefined();
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
  });
});