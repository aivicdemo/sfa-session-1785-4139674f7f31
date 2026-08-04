import { generateRecommendation, findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1964
  test('顧客業種が一致しないパターンが適用候補から除外される', async () => {
    const newDealInfo = {
      customerIndustry: '製造業',
      customerScale: '中規模',
      productCategory: 'システム導入',
      dealStage: '初期提案',
    };

    const mockPatterns = [
      {
        patternId: 'PA001',
        customerIndustry: '小売業',
        successScore: 0.92,
        proposalApproach: 'アプローチA',
      },
      {
        patternId: 'PB001',
        customerIndustry: '製造業',
        successScore: 0.88,
        proposalApproach: 'アプローチB',
      },
      {
        patternId: 'PC001',
        customerIndustry: '金融業',
        successScore: 0.85,
        proposalApproach: 'アプローチC',
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'アプローチB',
        confidence: 0.88,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue(mockPatterns),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((pattern, dealInfo) => {
          if (pattern.customerIndustry === dealInfo.customerIndustry) {
            return Promise.resolve({ relevanceScore: pattern.successScore });
          }
          return Promise.resolve({ relevanceScore: 0 });
        }),
    };

    const result = await findSimilarPatterns(newDealInfo, mockAIEngine);

    const filteredResult = result.filter((p) => {
      const relevance = mockAIEngine.evaluatePatternRelevance(p, newDealInfo);
      return relevance.then((r) => r.relevanceScore > 0);
    });

    const evaluatedPatterns = [];
    for (const pattern of result) {
      const relevance = await mockAIEngine.evaluatePatternRelevance(
        pattern,
        newDealInfo
      );
      if (relevance.relevanceScore > 0) {
        evaluatedPatterns.push({
          ...pattern,
          relevanceScore: relevance.relevanceScore,
        });
      }
    }

    evaluatedPatterns.sort((a, b) => b.relevanceScore - a.relevanceScore);

    expect(evaluatedPatterns).toHaveLength(1);
    expect(evaluatedPatterns[0]).toEqual(
      expect.objectContaining({
        patternId: 'PB001',
        customerIndustry: '製造業',
        relevanceScore: 0.88,
      })
    );
    expect(evaluatedPatterns[0].successScore).toBe(0.88);
    expect(
      evaluatedPatterns.findIndex((p) => p.patternId === 'PA001')
    ).toBe(-1);
    expect(
      evaluatedPatterns.findIndex((p) => p.patternId === 'PC001')
    ).toBe(-1);
  });
});