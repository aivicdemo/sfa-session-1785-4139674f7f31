import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-1-1-1';

describe('成功パターンテンプレート設計機能 - 言語化された成功要因の参照ID検証', () => {
  // SCEN-2504
  test('存在しない参照IDを含む成功要因データでテンプレート生成実行時、ERR_PATTERN_NOT_FOUNDエラーがスローされる', () => {
    const mockSuccessFactors = [
      {
        referenceId: 'SUC-INVALID-999',
        factorDescription: '存在しない成功要因',
        successRate: 85,
      },
    ];

    const mockRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = new Map([
      ['SUC-2024-001', { pattern: 'existing_pattern', weight: 0.9 }],
    ]);

    expect(() =>
      generateSuccessPatternTemplate(
        mockSuccessFactors,
        mockRecommendationEngine,
        mockPatternMaster
      )
    ).toThrow(/参照ID.*SUC-INVALID-999/);

    expect(mockRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});