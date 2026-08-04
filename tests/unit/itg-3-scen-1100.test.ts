import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1100
  test('推奨内容ID が空文字列のとき、根拠表示処理がエラーになる', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: '顧客の業種は製造業で、過去の成功事例から同業種向けの提案アプローチが有効であることが確認されています。'
      })
    };

    const emptyRecommendationId = '';

    expect(() => 
      explainRecommendationReasoning(emptyRecommendationId, mockAIRecommendationEngine)
    ).toThrow(/推奨内容ID/);

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});