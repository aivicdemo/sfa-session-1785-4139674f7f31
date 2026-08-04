import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能', () => {
  test('SCEN-1803: 推奨された提案アプローチが関連度スコアでランク付けされる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([
        {
          approach_id: 'PA001',
          name: 'クラウド移行支援パッケージ',
          relevance_score: 0.92,
          reasoning: 'IT業界の顧客でデジタル変革を推進、予算規模が合致'
        },
        {
          approach_id: 'PA002',
          name: 'データ分析基盤構築',
          relevance_score: 0.85,
          reasoning: 'デジタル変革における競合企業の成功事例に基づく提案'
        },
        {
          approach_id: 'PA003',
          name: 'プロセス自動化支援',
          relevance_score: 0.78,
          reasoning: '同規模企業での導入実績が豊富'
        }
      ]),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { pattern_id: 'SP001', success_rate: 0.88 },
        { pattern_id: 'SP002', success_rate: 0.82 }
      ]),
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce(0.92)
        .mockResolvedValueOnce(0.85)
        .mockResolvedValueOnce(0.78)
    };

    const newDealData = {
      customer_industry: 'IT',
      customer_challenge: 'デジタル変革',
      budget_amount: 5000000,
      company_size: '従業員500名'
    };

    const result = generateRecommendation(newDealData, mockAIEngine);

    return result.then((recommendations) => {
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBe(3);

      // 関連度スコアが降順に並んでいることを確認
      expect(recommendations[0].relevance_score).toBe(0.92);
      expect(recommendations[1].relevance_score).toBe(0.85);
      expect(recommendations[2].relevance_score).toBe(0.78);

      // 各要素が必須フィールドを持つことを確認
      recommendations.forEach((recommendation) => {
        expect(recommendation).toHaveProperty('approach_id');
        expect(recommendation).toHaveProperty('name');
        expect(recommendation).toHaveProperty('relevance_score');
        expect(recommendation).toHaveProperty('reasoning');
      });

      // 関連度スコアが0.0～1.0の範囲内であることを確認
      recommendations.forEach((recommendation) => {
        expect(recommendation.relevance_score).toBeGreaterThanOrEqual(0.0);
        expect(recommendation.relevance_score).toBeLessThanOrEqual(1.0);
      });

      // 最上位の推奨パターンの関連度スコアが他のパターンより高いことを確認
      expect(recommendations[0].relevance_score).toBeGreaterThan(recommendations[1].relevance_score);
      expect(recommendations[1].relevance_score).toBeGreaterThan(recommendations[2].relevance_score);

      // 最上位パターンの詳細を確認
      expect(recommendations[0].approach_id).toBe('PA001');
      expect(recommendations[0].name).toBe('クラウド移行支援パッケージ');
    });
  });
});