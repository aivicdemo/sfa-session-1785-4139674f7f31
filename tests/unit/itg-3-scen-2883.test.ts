import { validateRecommendationContent } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容検証判定機能', () => {
  test('SCEN-2883: 成功パターンのサンプルサイズが0のとき、エラーを返す', () => {
    // Arrange: AIRecommendationEngineのスタブを準備
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 成功パターンのサンプルサイズが0の入力パラメータを構築
    const recommendationInput = {
      successPatternSampleSize: 0,
      customerId: 'CUST-001',
      dealAmount: 500000,
      dealStage: 'proposal',
      industry: 'finance',
      companySize: 'large',
    };

    // Act: 推奨内容検証判定機能を実行
    const result = validateRecommendationContent(
      recommendationInput,
      aiRecommendationEngineStub
    );

    // Assert: 返却値がエラーオブジェクトであることを検証
    expect(result.isError).toBe(true);
    expect(result.errorCode).toBe('INVALID_SAMPLE_SIZE');
    expect(result.errorMessage).toBe(
      '成功パターンのサンプルサイズは1以上である必要があります'
    );

    // Assert: AIRecommendationEngineへのAPI呼び出しが実行されていないことを検証
    expect(aiRecommendationEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});