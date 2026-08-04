import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2809: 推奨内容の根拠情報がnullのとき、エラーを返す', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoningMethod: jest.fn().mockReturnValue({
        reasoningContent: null,
      }),
    };

    const recommendationId = 'REC-20240115-001';
    const dealConditions = {
      customerId: 'CUST-12345',
      customerIndustry: 'manufacturing',
      customerScale: 'enterprise',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    const requestObject = {
      recommendationId: recommendationId,
      dealConditions: dealConditions,
    };

    const callExplainRecommendationReasoning = () => {
      return explainRecommendationReasoning(
        requestObject,
        mockAIRecommendationEngine
      );
    };

    expect(callExplainRecommendationReasoning).toThrow(/推奨内容の根拠情報/);
  });
});