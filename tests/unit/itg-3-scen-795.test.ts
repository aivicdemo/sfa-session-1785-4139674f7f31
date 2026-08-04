import { generateRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-795
  test('推奨根拠データ生成機能 - 過去成功パターンから抽出した根拠データが構造化されて返却される', () => {
    const mockFindSimilarPatterns = jest.fn();
    const mockExplainRecommendationReasoning = jest.fn();
    const mockEvaluatePatternRelevance = jest.fn();

    const mockPatterns = [
      {
        patternId: 'PATTERN-001',
        customerId: 'C001',
        customerIndustry: '金融',
        dealAmount: 5000000,
        proposalApproach: 'デジタル変革支援',
        successFactors: ['リスク低減', 'ROI改善', 'スケーラビリティ'],
      },
      {
        patternId: 'PATTERN-002',
        customerId: 'C002',
        customerIndustry: '金融',
        dealAmount: 4500000,
        proposalApproach: 'クラウド移行',
        successFactors: ['コスト削減', '運用効率化', 'セキュリティ強化'],
      },
      {
        patternId: 'PATTERN-003',
        customerId: 'C003',
        customerIndustry: '金融',
        dealAmount: 5500000,
        proposalApproach: 'AI導入支援',
        successFactors: ['意思決定高速化', '顧客満足度向上', '競争力強化'],
      },
    ];

    mockFindSimilarPatterns.mockReturnValue(mockPatterns);

    mockExplainRecommendationReasoning.mockImplementation((patternId) => {
      const explanations: { [key: string]: string } = {
        'PATTERN-001': '金融業界における過去の成功事例から、リスク低減とROI改善が重要な成功要因であることが判明しています。',
        'PATTERN-002': 'クラウド移行により、運用コストの削減と業務効率化が実現した事例です。',
        'PATTERN-003': 'AI導入により、意思決定の高速化と顧客満足度の向上が確認された事例です。',
      };
      return explanations[patternId] || '';
    });

    mockEvaluatePatternRelevance.mockImplementation((patternId) => {
      const relevanceScores: { [key: string]: number } = {
        'PATTERN-001': 0.85,
        'PATTERN-002': 0.78,
        'PATTERN-003': 0.82,
      };
      return relevanceScores[patternId] || 0;
    });

    const newDealData = {
      customerName: 'テスト太郎',
      customerIndustry: '金融',
      dealAmount: 5000000,
      targetObjectives: ['リスク低減', 'ROI改善'],
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    const result = generateRecommendationReasoning(
      newDealData,
      mockAIRecommendationEngine as any
    );

    expect(result).toHaveProperty('patterns');
    expect(Array.isArray(result.patterns)).toBe(true);
    expect(result.patterns.length).toBeGreaterThanOrEqual(3);

    result.patterns.forEach((pattern: any) => {
      expect(pattern).toHaveProperty('patternId');
      expect(typeof pattern.patternId).toBe('string');

      expect(pattern).toHaveProperty('similarity');
      expect(typeof pattern.similarity).toBe('number');
      expect(pattern.similarity).toBeGreaterThanOrEqual(0);
      expect(pattern.similarity).toBeLessThanOrEqual(1);

      expect(pattern).toHaveProperty('relevanceScore');
      expect(typeof pattern.relevanceScore).toBe('number');
      expect(pattern.relevanceScore).toBeGreaterThanOrEqual(0.7);
      expect(pattern.relevanceScore).toBeLessThanOrEqual(1);

      expect(pattern).toHaveProperty('explanation');
      expect(typeof pattern.explanation).toBe('string');
      expect(pattern.explanation.length).toBeGreaterThan(0);

      expect(pattern).toHaveProperty('extractedFactors');
      expect(typeof pattern.extractedFactors).toBe('object');

      const factors = pattern.extractedFactors;
      expect(Array.isArray(factors.customerAttributes)).toBe(true);
      expect(factors.customerAttributes.length).toBeGreaterThanOrEqual(1);

      expect(Array.isArray(factors.dealConditions)).toBe(true);
      expect(factors.dealConditions.length).toBeGreaterThanOrEqual(1);

      expect(Array.isArray(factors.successFactors)).toBe(true);
      expect(factors.successFactors.length).toBeGreaterThanOrEqual(3);

      factors.successFactors.forEach((factor: string) => {
        expect(typeof factor).toBe('string');
        expect(factor.length).toBeGreaterThan(0);
      });
    });

    const filteredPatterns = result.patterns.filter(
      (p: any) => p.relevanceScore >= 0.7
    );
    expect(filteredPatterns.length).toBe(result.patterns.length);

    const jsonString = JSON.stringify(result);
    expect(typeof jsonString).toBe('string');
    const parsedResult = JSON.parse(jsonString);
    expect(parsedResult).toEqual(result);

    expect(result.patterns[0].relevanceScore).toBe(0.85);
    expect(result.patterns[1].relevanceScore).toBe(0.78);
    expect(result.patterns[2].relevanceScore).toBe(0.82);

    expect(result.patterns[0].patternId).toBe('PATTERN-001');
    expect(result.patterns[1].patternId).toBe('PATTERN-002');
    expect(result.patterns[2].patternId).toBe('PATTERN-003');
  });
});