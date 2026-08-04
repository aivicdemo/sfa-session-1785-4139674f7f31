import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2075
  test('提案内容と顧客対応パターンの標準プロセス照合分析 - 過去成功パターンが複数件の場合、全パターンとの適合度が計算される', () => {
    const mockSuccessPatterns = [
      {
        patternId: 'pat_001',
        industryType: 'IT',
        budgetRange: 5000000,
        implementationMonths: 3,
        successRate: 0.92,
        description: 'IT企業向け短期導入パターン',
      },
      {
        patternId: 'pat_002',
        industryType: 'IT',
        budgetRange: 5000000,
        implementationMonths: 3,
        successRate: 0.78,
        description: 'IT企業向け標準パターン',
      },
      {
        patternId: 'pat_003',
        industryType: 'IT',
        budgetRange: 5000000,
        implementationMonths: 3,
        successRate: 0.65,
        description: 'IT企業向け基本パターン',
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(mockSuccessPatterns),
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: 'rec_2075',
        customerId: 'cust_001',
        patterns: [
          {
            patternId: 'pat_001',
            relevanceScore: 0.92,
            rank: 1,
          },
          {
            patternId: 'pat_002',
            relevanceScore: 0.78,
            rank: 2,
          },
          {
            patternId: 'pat_003',
            relevanceScore: 0.65,
            rank: 3,
          },
        ],
        recommendedApproach: 'IT企業向け短期導入パターンを推奨',
        confidence: 0.92,
        timestamp: '2026-08-01T10:30:00Z',
      }),
      evaluatePatternRelevance: jest.fn((pattern) => {
        const scoreMap: { [key: string]: number } = {
          pat_001: 0.92,
          pat_002: 0.78,
          pat_003: 0.65,
        };
        return scoreMap[pattern.patternId] || 0;
      }),
    };

    const newCaseInput = {
      customerId: 'cust_001',
      industryType: 'IT',
      budgetAmount: 5000000,
      implementationPeriodMonths: 3,
      caseDescription: 'New IT company case requiring 3-month implementation',
    };

    const result = generateRecommendation(newCaseInput, mockAIEngine);

    expect(result.patterns).toBeDefined();
    expect(result.patterns.length).toBe(3);

    expect(result.patterns[0].relevanceScore).toBe(0.92);
    expect(result.patterns[0].rank).toBe(1);
    expect(result.patterns[0].patternId).toBe('pat_001');

    expect(result.patterns[1].relevanceScore).toBe(0.78);
    expect(result.patterns[1].rank).toBe(2);
    expect(result.patterns[1].patternId).toBe('pat_002');

    expect(result.patterns[2].relevanceScore).toBe(0.65);
    expect(result.patterns[2].rank).toBe(3);
    expect(result.patterns[2].patternId).toBe('pat_003');

    for (let i = 0; i < result.patterns.length - 1; i++) {
      expect(result.patterns[i].relevanceScore).toBeGreaterThanOrEqual(
        result.patterns[i + 1].relevanceScore
      );
    }

    expect(result.recommendedApproach).toBe(
      'IT企業向け短期導入パターンを推奨'
    );
    expect(result.confidence).toBe(0.92);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newCaseInput);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newCaseInput,
      mockSuccessPatterns
    );
  });
});