import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と顧客対応パターンの標準プロセス照合分析', () => {
  // SCEN-2091
  test('AIエージェント推奨生成失敗時に内部推奨パターンマスタから統計的上位パターンで代替される', async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error('API timeout')
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = [
      {
        patternId: 'PATTERN_A',
        successRate: 85,
        usageFrequency: 120,
        description: 'Executive steering with budget alignment',
        briefExplanation: 'Based on 120 similar cases with 85% success rate. Focus on budget alignment and decision-maker involvement.',
      },
      {
        patternId: 'PATTERN_B',
        successRate: 78,
        usageFrequency: 95,
        description: 'Technical validation approach',
        briefExplanation: 'Proven in 95 cases with 78% success rate.',
      },
      {
        patternId: 'PATTERN_C',
        successRate: 72,
        usageFrequency: 60,
        description: 'Phased implementation strategy',
        briefExplanation: 'Applicable to 60 historical cases.',
      },
    ];

    const newCaseData = {
      customerIndustry: '製造業',
      budgetScale: 5000000,
      decisionMakerCount: 3,
      caseId: 'CASE_2091',
    };

    const result = await generateRecommendation(
      newCaseData,
      mockRecommendationEngine,
      mockPatternMaster
    );

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newCaseData
    );

    expect(result.recommendedPattern.patternId).toBe('PATTERN_A');
    expect(result.recommendedPattern.successRate).toBe(85);
    expect(result.recommendedPattern.usageFrequency).toBe(120);

    expect(result.briefReasoning).toMatch(/85%/);
    expect(result.briefReasoning.split('\n').length).toBeLessThanOrEqual(3);

    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.isFallback).toBe(true);
  });
});