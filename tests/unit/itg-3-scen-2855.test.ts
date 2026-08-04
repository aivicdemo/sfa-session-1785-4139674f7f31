import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2855
  test('[normal] 推奨内容の根拠説明文生成機能 - 同じ推奨内容に対して複数回実行した場合、毎回同じ根拠説明文が生成される', async () => {
    const recommendation_input = {
      recommendationId: 'REC-12345',
      customerId: 'CUST-001',
      approachType: 'PATTERN_A',
      confidenceScore: 0.87
    };

    const expected_reasoning_text = '顧客の業界は製造業で、過去5年間の成功事例から提案パターンA（初期接触→ニーズ分析→カスタマイズ提案）が最適です。類似度スコア0.87';

    const mock_ai_engine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(expected_reasoning_text)
    };

    const reasoning_text_1 = await explainRecommendationReasoning(
      recommendation_input,
      mock_ai_engine
    );

    const reasoning_text_2 = await explainRecommendationReasoning(
      recommendation_input,
      mock_ai_engine
    );

    const reasoning_text_3 = await explainRecommendationReasoning(
      recommendation_input,
      mock_ai_engine
    );

    expect(reasoning_text_1).toBe(expected_reasoning_text);
    expect(reasoning_text_2).toBe(expected_reasoning_text);
    expect(reasoning_text_3).toBe(expected_reasoning_text);
    expect(reasoning_text_1).toBe(reasoning_text_2);
    expect(reasoning_text_2).toBe(reasoning_text_3);
  });
});