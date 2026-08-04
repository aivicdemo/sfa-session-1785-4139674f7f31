import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-969
  test('提案内容が null のとき、根拠表示処理が開始されず警告が返される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue(null),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = explainRecommendationReasoning(mockAIEngine, {
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      productCategory: 'software',
    });

    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();

    expect(result).toEqual({
      code: 'INVALID_RECOMMENDATION',
      message: expect.stringMatching(/提案内容がnull|根拠表示処理をスキップ/),
    });
  });
});