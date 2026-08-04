import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2563
  test('推奨内容が1件のとき、1つの根拠が表示される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendation: '提案アプローチA',
        reasoningList: ['根拠1'],
      }),
    };

    const result = displayRecommendationReasoning(mockAIRecommendationEngine);

    expect(result.reasoningList).toHaveLength(1);
    expect(result.reasoningList[0]).toBe('根拠1');
    expect(result.recommendation).toBe('提案アプローチA');
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(1);
  });
});