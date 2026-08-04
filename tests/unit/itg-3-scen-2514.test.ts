import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-1-1-1';

describe('成功パターンテンプレート設計機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2514
  test('AIエージェント推奨ロジック設定スキーマが空のとき、テンプレート生成がエラーになる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockRejectedValue(
        new Error('ValidationError: recommendationLogicSchema is required')
      ),
    };

    const emptySchemaInput = '';
    const templateGenerationRequest = {
      recommendationLogicSchema: emptySchemaInput,
      successPatternData: [
        {
          caseId: 'CASE001',
          customerIndustry: 'IT',
          customerSize: 'large',
          proposalApproach: 'consultative',
          conclusionResult: 'success',
        },
      ],
    };

    expect(() =>
      generateSuccessPatternTemplate(templateGenerationRequest, mockAIRecommendationEngine)
    ).toThrow(/recommendationLogicSchema is required/);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});