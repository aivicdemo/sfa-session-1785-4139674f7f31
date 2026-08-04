import { RecommendationReasoningService } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1837
  test('顧客IDが空文字列のとき根拠情報取得に失敗する', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const service = new RecommendationReasoningService(mockAIRecommendationEngine);

    const emptyCustomerId = '';

    expect(() => {
      service.getRecommendationReasoning(emptyCustomerId);
    }).toThrow(/顧客ID/);

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});