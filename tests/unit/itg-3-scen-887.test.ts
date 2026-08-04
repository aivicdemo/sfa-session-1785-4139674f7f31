import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨根拠データの提示機能 - 成功パターン抽出データが複数件のとき', () => {
  // SCEN-887
  test('すべてのパターンが根拠として提示される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          industryType: '製造業',
          budgetRange: '5000万円',
          decisionMakerCount: 3,
          successRate: 0.85,
          matchScore: 0.92,
        },
        {
          patternId: 'pattern_002',
          industryType: '製造業',
          budgetRange: '5000万円',
          decisionMakerCount: 3,
          successRate: 0.78,
          matchScore: 0.88,
        },
        {
          patternId: 'pattern_003',
          industryType: '製造業',
          budgetRange: '5000万円',
          decisionMakerCount: 3,
          successRate: 0.81,
          matchScore: 0.86,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        pattern_001: '業界別アプローチ：製造業向けの効率化提案は設備投資フェーズで決裁者3名の合意が必須。本パターンは過去12件中10件で成約（成功率83%）。',
        pattern_002: '価格帯別戦略：5000万円予算帯では分割払い提案が有効。本パターンマッチ企業の78%が初回提案から3ヶ月以内に成約。',
        pattern_003: '決裁層別提案順序：決裁者3名の場合、経営層→技術層→財務層の順序で提案すると成功率が81%に向上。本パターンは業界平均60%を上回る。',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.88),
    };

    const newDealData = {
      customerId: 'cust_test_001',
      customerIndustry: '製造業',
      budgetAmount: 50000000,
      decisionMakerCount: 3,
      dealStage: 'initial_contact',
      productCategory: '生産効率化システム',
    };

    const result = await generateRecommendation(newDealData, mockAIEngine);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();

    expect(result.reasoningPatterns).toBeDefined();
    expect(Array.isArray(result.reasoningPatterns)).toBe(true);
    expect(result.reasoningPatterns.length).toBe(3);

    expect(result.reasoningPatterns[0]).toMatchObject({
      patternId: 'pattern_001',
      reasoning: expect.stringContaining('業界別アプローチ'),
    });

    expect(result.reasoningPatterns[1]).toMatchObject({
      patternId: 'pattern_002',
      reasoning: expect.stringContaining('価格帯別戦略'),
    });

    expect(result.reasoningPatterns[2]).toMatchObject({
      patternId: 'pattern_003',
      reasoning: expect.stringContaining('決裁層別提案順序'),
    });

    result.reasoningPatterns.forEach((pattern) => {
      expect(pattern.reasoning).toBeTruthy();
      expect(typeof pattern.reasoning).toBe('string');
      expect(pattern.reasoning.length).toBeGreaterThan(0);
    });

    expect(result.confidenceScore).toBe(88);
  });
});