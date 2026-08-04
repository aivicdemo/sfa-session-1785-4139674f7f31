import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ自動推奨', () => {
  // SCEN-1551
  test('複数の提案アプローチが推奨される場合、全アプローチが結果に含まれる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproaches: [
          {
            name: 'ソリューション営業アプローチ',
            score: 92,
            reasoning: '顧客の経営課題に対して包括的なソリューション提案が効果的'
          },
          {
            name: 'コンサルティングアプローチ',
            score: 85,
            reasoning: '業界知見を活かしたコンサルティング支援で信頼構築が可能'
          },
          {
            name: 'パートナー連携アプローチ',
            score: 78,
            reasoning: 'パートナー企業との協業により実装リスクを低減できる'
          }
        ]
      })
    };

    const newDealData = {
      customerId: 'CUST-2024-001',
      customerIndustry: '製造業',
      customerScale: '従業員500-1000名',
      dealAmount: 5000000,
      dealStage: '初期接触',
      dealDescription: 'デジタル変革支援',
      timeline: '3ヶ月以内'
    };

    const result = generateRecommendation(newDealData, mockAIRecommendationEngine);

    expect(result.recommendedApproaches).toHaveLength(3);
    
    expect(result.recommendedApproaches).toContainEqual({
      name: 'ソリューション営業アプローチ',
      score: 92,
      reasoning: '顧客の経営課題に対して包括的なソリューション提案が効果的'
    });
    
    expect(result.recommendedApproaches).toContainEqual({
      name: 'コンサルティングアプローチ',
      score: 85,
      reasoning: '業界知見を活かしたコンサルティング支援で信頼構築が可能'
    });
    
    expect(result.recommendedApproaches).toContainEqual({
      name: 'パートナー連携アプローチ',
      score: 78,
      reasoning: 'パートナー企業との協業により実装リスクを低減できる'
    });

    const approachNames = result.recommendedApproaches.map(a => a.name);
    const uniqueNames = new Set(approachNames);
    expect(uniqueNames.size).toBe(3);

    result.recommendedApproaches.forEach(approach => {
      expect(approach).toHaveProperty('name');
      expect(approach).toHaveProperty('score');
      expect(approach).toHaveProperty('reasoning');
      expect(typeof approach.name).toBe('string');
      expect(typeof approach.score).toBe('number');
      expect(typeof approach.reasoning).toBe('string');
      expect(approach.score).toBeGreaterThan(0);
      expect(approach.score).toBeLessThanOrEqual(100);
    });

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealData
    );
  });
});