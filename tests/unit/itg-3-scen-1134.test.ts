import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1134
  test('商談条件マッチング機能 - 顧客の業種コード、業界カテゴリが過去成功パターンと完全一致するとき、最高優先度で推奨する', () => {
    const pastSuccessPattern = {
      industryCode: '1234',
      industryCategory: '製造業',
      priority: 1,
      successRate: 95,
      patternId: 'PATTERN-001',
    };

    const newDealCondition = {
      customerIndustryCode: '1234',
      customerIndustryCategory: '製造業',
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PATTERN-001',
          matchScore: 1.0,
          industryCode: '1234',
          industryCategory: '製造業',
          priority: 1,
          successRate: 95,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicabilityScore: 1.0,
        isApplicable: true,
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = generateRecommendation(newDealCondition, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.priority).toBe(1);
    expect(result.exactMatch).toBe(true);
    expect(result.matchScore).toBe(1.0);
    expect(result.applicabilityScore).toBe(1.0);
    expect(result.reasoning).toContain('業種コード');
    expect(result.reasoning).toContain('業界カテゴリ');
    expect(result.reasoning).toContain('完全一致');
    expect(result.reasoning).toContain('95');
    expect(result.patternId).toBe('PATTERN-001');
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealCondition);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        patternId: 'PATTERN-001',
        matchScore: 1.0,
      }),
      newDealCondition
    );
  });
});