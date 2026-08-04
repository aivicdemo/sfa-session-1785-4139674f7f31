import { extractImprovementItems } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-539
  test('改善対象項目抽出機能 - データ品質カテゴリが欠落しているときアイテムが抽出から除外される', () => {
    const mockPatternWithNullCategory = {
      patternId: 'pattern-null-001',
      customerIndustry: 'IT',
      customerScale: 'large',
      successRate: 0.85,
      dataQualityCategory: null,
      improvementPriority: 'high',
      recommendedApproach: 'approach-1',
      createdAt: new Date('2024-01-15T11:00:00Z'),
    };

    const mockPatternWithValidCategory = {
      patternId: 'pattern-valid-001',
      customerIndustry: 'Manufacturing',
      customerScale: 'medium',
      successRate: 0.78,
      dataQualityCategory: 'customer_data_completeness',
      improvementPriority: 'medium',
      recommendedApproach: 'approach-2',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    const mockPatternWithAnotherValidCategory = {
      patternId: 'pattern-valid-002',
      customerIndustry: 'Finance',
      customerScale: 'small',
      successRate: 0.92,
      dataQualityCategory: 'data_normalization_rule_accuracy',
      improvementPriority: 'high',
      recommendedApproach: 'approach-3',
      createdAt: new Date('2024-01-15T09:00:00Z'),
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        mockPatternWithNullCategory,
        mockPatternWithValidCategory,
        mockPatternWithAnotherValidCategory,
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputCondition = {
      customerIndustry: 'IT',
      customerScale: 'large',
      currentProposalContent: 'cloud-migration-proposal',
    };

    const result = extractImprovementItems(inputCondition, mockAIEngine);

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          patternId: 'pattern-valid-001',
          dataQualityCategory: 'customer_data_completeness',
        }),
        expect.objectContaining({
          patternId: 'pattern-valid-002',
          dataQualityCategory: 'data_normalization_rule_accuracy',
        }),
      ])
    );

    const extractedPatternIds = result.map((item) => item.patternId);
    expect(extractedPatternIds).not.toContain('pattern-null-001');
  });
});