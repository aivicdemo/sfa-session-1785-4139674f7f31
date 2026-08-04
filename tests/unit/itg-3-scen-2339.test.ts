import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2339
  test('推奨根拠の自然言語説明生成 - OpenAI API呼び出しで根拠の自然言語説明が正常に生成される', async () => {
    const mock_ai_engine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        success: true,
        reasoning:
          '顧客の業界は製造業で、過去成功事例との類似度は0.87です。提案アプローチ「コスト削減重視」は同業他社での成約率が78%であるため推奨されます。',
        confidence: 0.87,
      }),
    };

    const input_params = {
      recommendationId: 'REC-20260801-001',
      dealConditions: {
        industry: '製造業',
        dealAmount: 5000000,
        decisionMaker: '購買部長',
      },
      pastPatterns: [
        {
          patternId: 'PAT-001',
          matchScore: 0.87,
          successRate: 0.78,
        },
      ],
    };

    const start_time = Date.now();
    const response = await explainRecommendationReasoning(
      input_params,
      mock_ai_engine
    );
    const elapsed_time_ms = Date.now() - start_time;

    expect(response.success).toBe(true);
    expect(response.confidence).toBe(0.87);
    expect(typeof response.reasoning).toBe('string');
    expect(response.reasoning.length).toBeGreaterThanOrEqual(150);
    expect(response.reasoning.length).toBeLessThanOrEqual(500);
    expect(response.reasoning).toContain('製造業');
    expect(response.reasoning).toContain('0.87');
    expect(response.reasoning).toContain('78%');
    expect(response.reasoning).toContain('コスト削減重視');
    expect(elapsed_time_ms).toBeLessThan(30000);
  });
});