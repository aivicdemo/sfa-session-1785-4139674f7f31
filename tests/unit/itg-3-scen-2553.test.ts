import { explain_recommendation_reasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2553
  test('推奨根拠テキストが欠落しているとき、MissingRecommendationReasoningException例外が発生する', () => {
    const recommendation_id = 'rec-20240115-001';
    const customer_id = 'cust-12345';
    const customer_name = 'Acme Corporation';
    const customer_industry = 'Technology';

    const stub_ai_engine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(null),
    };

    const input_params = {
      recommendation_id,
      customer_id,
      customer_name,
      customer_industry,
      ai_engine: stub_ai_engine,
    };

    expect(() => {
      explain_recommendation_reasoning(input_params);
    }).toThrow(/推奨根拠テキスト/);
  });
});