import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-890
  test('[edge] 推奨根拠データの提示機能 - 根拠データに重複を含むとき重複分が除外されて提示される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue([
        { id: 'evidence-1', content: '過去成功事例A', similarity: 0.95 },
        { id: 'evidence-2', content: '過去成功事例B', similarity: 0.92 },
        { id: 'evidence-1', content: '過去成功事例A', similarity: 0.95 }
      ])
    };

    const newCaseInfo = {
      customerIndustry: '製造業',
      budget: 5000000,
      challenge: '業務効率化'
    };

    const result = await explainRecommendationReasoning(
      newCaseInfo,
      mockAIEngine
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 'evidence-1',
      content: '過去成功事例A',
      similarity: 0.95
    });
    expect(result[1]).toEqual({
      id: 'evidence-2',
      content: '過去成功事例B',
      similarity: 0.92
    });
  });
});