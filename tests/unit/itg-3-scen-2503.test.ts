import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2503
  test('成功パターンテンプレート設計機能 - 営業部長の指示内容が空文字列のとき、テンプレート生成がエラーになる', () => {
    const customerInfo = {
      companyName: 'テスト会社',
      industry: 'IT',
      scale: 'mid',
    };

    const dealConditions = {
      dealStage: 'initial',
      budgetRange: 'high',
      timeline: 'short',
    };

    const directionFromManager = '';

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = generateRecommendation(
      customerInfo,
      dealConditions,
      directionFromManager,
      aiRecommendationEngineStub
    );

    expect(result).toHaveProperty('errorCode', 'INVALID_INPUT_ERROR');
    expect(result).toHaveProperty('errorMessage');
    expect(result.errorMessage).toMatch(/営業部長の指示内容は空にできません/);
    expect(aiRecommendationEngineStub.generateRecommendation).not.toHaveBeenCalled();
  });
});