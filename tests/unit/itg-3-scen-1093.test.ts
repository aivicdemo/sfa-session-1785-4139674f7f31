import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1093
  test('推奨根拠のテキスト説明が null のとき、根拠可視化処理がエラーになる', () => {
    const stubEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(null),
    };

    const recommendationWithNullReasoning = {
      recommendation_id: 'rec_001',
      customer_id: 'cust_001',
      proposal_content: '新規商品提案',
      confidence_score: 85,
      reasoning_text: null,
      created_at: new Date('2024-01-15T10:30:00Z'),
    };

    expect(() =>
      explainRecommendationReasoning(
        recommendationWithNullReasoning,
        stubEngine
      )
    ).toThrow(/推奨根拠のテキスト説明/);
  });
});