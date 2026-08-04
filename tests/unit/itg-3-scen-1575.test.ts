import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1575: 推奨内容が空のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoningStub: jest.fn().mockReturnValue(''),
    };

    const emptyRecommendationData = {
      recommendationId: 'REC-001',
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      recommendationContent: '',
      confidenceScore: 0,
      reasoning: '',
    };

    expect(() => {
      explainRecommendationReasoning(
        emptyRecommendationData,
        mockAIRecommendationEngine.explainRecommendationReasoningStub
      );
    }).toThrow(/推奨根拠/);

    try {
      explainRecommendationReasoning(
        emptyRecommendationData,
        mockAIRecommendationEngine.explainRecommendationReasoningStub
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/推奨根拠が取得できません/);
        expect(error.stack).toMatch(/explainRecommendationReasoning returned empty string/);
      }
    }
  });
});