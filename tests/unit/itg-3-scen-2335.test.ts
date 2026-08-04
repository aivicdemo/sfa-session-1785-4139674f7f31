import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2335
  test('推奨根拠の自然言語説明生成機能 - 推奨根拠データが1件のとき1件分の説明文が生成される', async () => {
    fetchMock.resetMocks();

    const testRecommendationReasons = [
      {
        patternId: 'PAT-001',
        similarity: 0.95,
        successRate: 0.88,
        description: '過去同業種での成功事例',
      },
    ];

    const mockExplainResponse = {
      explanation:
        'パターンID PAT-001 は過去同業種での成功事例（類似度95%、成功率88%）に基づいており、現在の商談条件に適用可能です。',
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockExplainResponse), {
      status: 200,
    });

    const aiRecommendationEngineStub = {
      explainRecommendationReasoning: async (reasons: typeof testRecommendationReasons) => {
        const response = await fetch('https://api.openai.example.com/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reasons }),
        });
        const data = await response.json();
        return data.explanation;
      },
    };

    const result = await explainRecommendationReasoning(
      testRecommendationReasons,
      aiRecommendationEngineStub
    );

    expect(result).toBe(
      'パターンID PAT-001 は過去同業種での成功事例（類似度95%、成功率88%）に基づいており、現在の商談条件に適用可能です。'
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('https://api.openai.example.com/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reasons: testRecommendationReasons,
      }),
    });
  });
});