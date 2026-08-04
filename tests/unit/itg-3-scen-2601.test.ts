import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  // SCEN-2601
  test('適合度スコア50点の場合、判定結果が正確に計算される', () => {
    const newDealData = {
      customerSize: 'medium_enterprise',
      industry: 'manufacturing',
      budget: 5000000,
      implementationTimeline: 90,
    };

    const successPatternTemplate = {
      pattern_id: 'pattern_001',
      customer_size_range: ['medium_enterprise', 'large_enterprise'],
      industry_category: ['manufacturing', 'logistics'],
      budget_range_min: 3000000,
      budget_range_max: 10000000,
      implementation_timeline_min: 60,
      implementation_timeline_max: 180,
      success_count: 45,
      total_count: 90,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(50),
    };

    const result = evaluatePatternRelevance(
      newDealData,
      successPatternTemplate,
      mockAIEngine
    );

    expect(result.score).toBe(50);
    expect(result.judgmentRank).toBe('中程度適合');
    expect(result.confidenceLevel).toBe('中');
    expect(result.recommendedAction).toBe(
      '基本提案パターンを使用し、業種固有カスタマイズを追加検討'
    );
  });
});