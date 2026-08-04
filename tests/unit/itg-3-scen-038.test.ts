import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容生成機能 - 複数成功パターン統合', () => {
  test('SCEN-038: 複数件の過去成功パターンから統合された推奨内容が正常に生成される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'patternA',
          industry: '製造業',
          productCategory: 'システム導入',
          approach: 'エグゼクティブ層への段階的提案',
          successRate: 0.92,
          relevanceScore: 0.92,
        },
        {
          patternId: 'patternB',
          industry: '製造業',
          productCategory: 'システム導入',
          approach: 'ROI試算による説得',
          successRate: 0.87,
          relevanceScore: 0.87,
        },
        {
          patternId: 'patternC',
          industry: '製造業',
          productCategory: 'システム導入',
          approach: '実装サポート体制の強調',
          successRate: 0.78,
          relevanceScore: 0.78,
        },
      ]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach:
          'エグゼクティブ層への段階的提案によるROI説得、実装サポート体制の強調を組み合わせたアプローチ',
        referencedPatterns: ['patternA', 'patternB', 'patternC'],
        relevanceScores: {
          patternA: 0.92,
          patternB: 0.87,
          patternC: 0.78,
        },
        reasoning:
          '製造業の大型システム導入案件では、エグゼクティブ層への段階的提案（成功率92%）とROI試算による説得（成功率87%）の組み合わせが最も効果的。実装サポート体制の強調（成功率78%）で購買後の不安を軽減することで、総合的な採用率向上が期待できます。',
        status: 'success',
        generatedAt: '2024-01-15T11:30:00Z',
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newProjectInput = {
      customerIndustry: '製造業',
      productCategory: 'システム導入',
      budgetScale: 'large',
      dealValue: 5000000,
    };

    const currentTime = new Date('2024-01-15T11:30:00Z');
    jest.useFakeTimers().setSystemTime(currentTime);

    const result = generateRecommendation(newProjectInput, mockAIEngine);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();

    expect(result).toEqual({
      recommendedApproach:
        'エグゼクティブ層への段階的提案によるROI説得、実装サポート体制の強調を組み合わせたアプローチ',
      referencedPatterns: ['patternA', 'patternB', 'patternC'],
      relevanceScores: {
        patternA: 0.92,
        patternB: 0.87,
        patternC: 0.78,
      },
      reasoning:
        '製造業の大型システム導入案件では、エグゼクティブ層への段階的提案（成功率92%）とROI試算による説得（成功率87%）の組み合わせが最も効果的。実装サポート体制の強調（成功率78%）で購買後の不安を軽減することで、総合的な採用率向上が期待できます。',
      status: 'success',
      generatedAt: '2024-01-15T11:30:00Z',
    });

    expect(result.referencedPatterns).toHaveLength(3);
    expect(result.referencedPatterns).toContain('patternA');
    expect(result.referencedPatterns).toContain('patternB');
    expect(result.referencedPatterns).toContain('patternC');

    expect(result.relevanceScores.patternA).toBeGreaterThanOrEqual(0.0);
    expect(result.relevanceScores.patternA).toBeLessThanOrEqual(1.0);
    expect(result.relevanceScores.patternB).toBeGreaterThanOrEqual(0.0);
    expect(result.relevanceScores.patternB).toBeLessThanOrEqual(1.0);
    expect(result.relevanceScores.patternC).toBeGreaterThanOrEqual(0.0);
    expect(result.relevanceScores.patternC).toBeLessThanOrEqual(1.0);

    expect(result.recommendedApproach).toContain('エグゼクティブ層');
    expect(result.recommendedApproach).toContain('ROI');
    expect(result.recommendedApproach).toContain('実装サポート');

    expect(result.reasoning).toBeTruthy();
    expect(result.reasoning.length).toBeGreaterThan(0);

    expect(result.status).toBe('success');

    const generatedTime = new Date(result.generatedAt);
    const timeDiff = Math.abs(generatedTime.getTime() - currentTime.getTime());
    expect(timeDiff).toBeLessThanOrEqual(5000);

    jest.useRealTimers();
  });
});