import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2803
  test('参考事例リストがnullのとき、適切なエラーオブジェクトを返す', () => {
    const recommendationId = 'REC-20240115-001';
    const customerId = 'CUST-2024-0042';
    
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanation: 'Explanation text',
        reasoningContext: {
          referenceExamples: null,
          successPatterns: ['pattern1', 'pattern2'],
          riskFactors: ['risk1']
        }
      })
    };

    const result = explainRecommendationReasoning(
      recommendationId,
      customerId,
      mockAIEngine
    );

    expect(result).toEqual({
      code: 'REFERENCE_EXAMPLES_NULL',
      message: '参考事例リストが取得できません。根拠の表示に失敗しました',
      httpStatusCode: 400
    });
  });
});