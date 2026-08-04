import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1435
  test('成功パターンリストが重複データを含むとき、重複排除の上推奨が生成される', async () => {
    const duplicateSuccessPatterns = [
      {
        patternId: 'P001',
        approach: '顧客課題ヒアリング重視',
        successRate: 0.85,
      },
      {
        patternId: 'P001',
        approach: '顧客課題ヒアリング重視',
        successRate: 0.85,
      },
      {
        patternId: 'P002',
        approach: 'ROI提示戦略',
        successRate: 0.78,
      },
    ];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(async () => ({
        recommendations: duplicateSuccessPatterns,
      })),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(async (pattern: any) => {
        if (pattern.patternId === 'P001') {
          return { patternId: 'P001', relevanceScore: 0.92 };
        }
        if (pattern.patternId === 'P002') {
          return { patternId: 'P002', relevanceScore: 0.78 };
        }
        return { relevanceScore: 0.0 };
      }),
    };

    const newDealCondition = {
      customerIndustry: '製造業',
      budgetScale: 10000000,
      decisionMakerCount: 3,
    };

    const result = await generateRecommendation(
      newDealCondition,
      mockAIRecommendationEngine
    );

    const uniquePatterns = result.filter(
      (pattern: any, index: number, self: any[]) =>
        self.findIndex(
          (p: any) =>
            p.patternId === pattern.patternId &&
            p.approach === pattern.approach
        ) === index
    );

    expect(uniquePatterns).toHaveLength(2);

    expect(uniquePatterns[0].patternId).toBe('P001');
    expect(uniquePatterns[0].approach).toBe('顧客課題ヒアリング重視');
    expect(uniquePatterns[0].successRate).toBe(0.85);

    expect(uniquePatterns[1].patternId).toBe('P002');
    expect(uniquePatterns[1].approach).toBe('ROI提示戦略');
    expect(uniquePatterns[1].successRate).toBe(0.78);

    expect(uniquePatterns[0].successRate).toBeGreaterThan(
      uniquePatterns[1].successRate
    );

    expect(uniquePatterns[0].relevanceScore).toBeDefined();
    expect(uniquePatterns[0].relevanceScore).toBeGreaterThanOrEqual(0.0);
    expect(uniquePatterns[0].relevanceScore).toBeLessThanOrEqual(1.0);

    expect(uniquePatterns[1].relevanceScore).toBeDefined();
    expect(uniquePatterns[1].relevanceScore).toBeGreaterThanOrEqual(0.0);
    expect(uniquePatterns[1].relevanceScore).toBeLessThanOrEqual(1.0);

    expect(uniquePatterns[0].relevanceScore).toBe(0.92);
    expect(uniquePatterns[1].relevanceScore).toBe(0.78);
  });
});