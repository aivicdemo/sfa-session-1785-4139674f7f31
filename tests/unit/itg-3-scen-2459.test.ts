import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2459
  test('過去商談データから成功要因が1件抽出され、構造化テンプレートに反映される', () => {
    const pastDealData = {
      dealId: 'DEAL_001',
      customerIndustry: '製造業',
      dealAmount: 5000000,
      successFactors: ['顧客の課題ヒアリング徹底'],
      dealStatus: 'won',
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PATTERN_001',
          factorName: '顧客の課題ヒアリング徹底',
          applicableIndustry: '製造業',
          applicableAmountRange: '500万円',
          confidenceScore: 1.0,
        },
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = extractSuccessPatterns(pastDealData, mockAIEngine);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(pastDealData);
    expect(result).toEqual({
      extractedCount: 1,
      patterns: [
        {
          patternId: 'PATTERN_001',
          factorName: '顧客の課題ヒアリング徹底',
          applicableIndustry: '製造業',
          applicableAmountRange: '500万円',
          confidenceScore: 1.0,
        },
      ],
    });
    expect(result.extractedCount).toBe(1);
    expect(result.patterns[0].patternId).toBe('PATTERN_001');
    expect(result.patterns[0].factorName).toBe('顧客の課題ヒアリング徹底');
    expect(result.patterns[0].applicableIndustry).toBe('製造業');
    expect(result.patterns[0].applicableAmountRange).toBe('500万円');
    expect(result.patterns[0].confidenceScore).toBe(1.0);
  });
});