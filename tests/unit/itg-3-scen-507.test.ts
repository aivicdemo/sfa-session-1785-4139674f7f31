import { decideSalesmanGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定機能', () => {
  test('SCEN-507: 指導内容が null のとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const salesmanInfo = {
      id: 'sales-001',
      name: '山田太郎',
    };

    const guidancePolicyParams = {
      salesman: salesmanInfo,
      guidanceContent: null,
      aiEngine: mockAIEngine,
    };

    expect(() => decideSalesmanGuidancePolicy(guidancePolicyParams)).toThrow(
      /指導内容/
    );
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});