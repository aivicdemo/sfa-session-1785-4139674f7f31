import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2064
  test('類似パターン検索がOpenAI Embeddingsで正常に応答した場合、検索結果がランク付けされて返却される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
    };

    const pastSuccessPatterns = [
      {
        patternId: 'pattern-001',
        embedding: Array(1536).fill(0.1),
        commercialConditions: {
          customerIndustry: 'manufacturing',
          productCategory: 'automation',
          budgetRange: 'large',
        },
        successMetrics: {
          closureRate: 0.82,
          projectScale: 5000000,
          contractDuration: 24,
        },
      },
      {
        patternId: 'pattern-002',
        embedding: Array(1536).fill(0.15),
        commercialConditions: {
          customerIndustry: 'manufacturing',
          productCategory: 'automation',
          budgetRange: 'medium',
        },
        successMetrics: {
          closureRate: 0.75,
          projectScale: 2000000,
          contractDuration: 12,
        },
      },
      {
        patternId: 'pattern-003',
        embedding: Array(1536).fill(0.08),
        commercialConditions: {
          customerIndustry: 'retail',
          productCategory: 'pos_system',
          budgetRange: 'small',
        },
        successMetrics: {
          closureRate: 0.68,
          projectScale: 500000,
          contractDuration: 6,
        },
      },
    ];

    const currentDealConditions = {
      customerIndustry: 'manufacturing',
      productCategory: 'automation',
      budgetRange: 'large',
      customerScale: 'large_enterprise',
    };

    const mockResponse = [
      {
        patternId: 'pattern-001',
        similarityScore: 0.92,
        matchedConditions: [
          'customerIndustry',
          'productCategory',
          'budgetRange',
        ],
        successMetrics: {
          closureRate: 0.82,
          projectScale: 5000000,
          contractDuration: 24,
        },
      },
      {
        patternId: 'pattern-002',
        similarityScore: 0.88,
        matchedConditions: ['customerIndustry', 'productCategory'],
        successMetrics: {
          closureRate: 0.75,
          projectScale: 2000000,
          contractDuration: 12,
        },
      },
      {
        patternId: 'pattern-003',
        similarityScore: 0.45,
        matchedConditions: ['productCategory'],
        successMetrics: {
          closureRate: 0.68,
          projectScale: 500000,
          contractDuration: 6,
        },
      },
    ];

    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValue(
      mockResponse
    );

    const result = await findSimilarPatterns(
      currentDealConditions,
      pastSuccessPatterns,
      mockAIRecommendationEngine
    );

    expect(result).toHaveLength(3);

    expect(result[0].patternId).toBe('pattern-001');
    expect(result[0].similarityScore).toBe(0.92);
    expect(result[0].matchedConditions).toEqual([
      'customerIndustry',
      'productCategory',
      'budgetRange',
    ]);
    expect(result[0].successMetrics).toEqual({
      closureRate: 0.82,
      projectScale: 5000000,
      contractDuration: 24,
    });

    expect(result[1].patternId).toBe('pattern-002');
    expect(result[1].similarityScore).toBe(0.88);

    expect(result[2].patternId).toBe('pattern-003');
    expect(result[2].similarityScore).toBe(0.45);

    expect(result[0].similarityScore).toBeGreaterThan(
      result[1].similarityScore
    );
    expect(result[1].similarityScore).toBeGreaterThan(
      result[2].similarityScore
    );

    expect(result[0].similarityScore).toBeGreaterThanOrEqual(0.85);

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toHaveProperty('patternId');
      expect(result[i]).toHaveProperty('similarityScore');
      expect(result[i]).toHaveProperty('matchedConditions');
      expect(result[i]).toHaveProperty('successMetrics');

      expect(typeof result[i].patternId).toBe('string');
      expect(typeof result[i].similarityScore).toBe('number');
      expect(Array.isArray(result[i].matchedConditions)).toBe(true);
      expect(typeof result[i].successMetrics).toBe('object');
    }
  });
});