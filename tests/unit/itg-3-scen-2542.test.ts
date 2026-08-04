import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2542
  test('成功パターンテンプレート生成日が月初のとき、テンプレートに記録される', () => {
    const monthStartDate = new Date('2026-01-01T09:30:00Z');
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approachId: 'approach_001',
        successFactors: ['要因1', '要因2'],
        failureFactors: ['失敗要因1'],
        applicableConditions: {
          industryType: '製造業',
          companySize: '大企業',
        },
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const templateInput = {
      successPatterns: [
        {
          caseId: 'case_001',
          industry: '製造業',
          companySize: 'large',
          proposalApproach: 'アプローチA',
          contractResult: 'success' as const,
        },
        {
          caseId: 'case_002',
          industry: '製造業',
          companySize: 'large',
          proposalApproach: 'アプローチA',
          contractResult: 'success' as const,
        },
      ],
      failurePatterns: [
        {
          caseId: 'case_003',
          industry: '製造業',
          companySize: 'large',
          proposalApproach: 'アプローチB',
          contractResult: 'failure' as const,
        },
      ],
      generatedAtUtc: monthStartDate,
    };

    const result = generateSuccessPatternTemplate(templateInput, mockAIEngine);

    expect(result.generatedDate).toBe('2026-01-01T09:30:00Z');
    expect(result.templateId).toBeDefined();
    expect(result.templateId.length).toBeGreaterThan(0);
    expect(result.successFactors).toEqual(expect.arrayContaining(['要因1', '要因2']));
    expect(result.failureFactors).toEqual(expect.arrayContaining(['失敗要因1']));
    expect(result.applicableConditions.industryType).toBe('製造業');
    expect(result.applicableConditions.companySize).toBe('大企業');
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        successPatterns: expect.arrayContaining([
          expect.objectContaining({
            caseId: 'case_001',
          }),
        ]),
      })
    );
  });
});