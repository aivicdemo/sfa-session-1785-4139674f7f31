import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2683: 推奨内容の信頼度スコアが閾値直下（69.9%）のとき、根拠表示から除外される', () => {
    // Arrange: AIRecommendationEngineのスタブを定義
    const mock_evaluatePatternRelevance = jest.fn().mockReturnValue(69.9);
    const mock_explainRecommendationReasoning = jest.fn();

    const stub_AIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendation_id: 'rec-001',
        customer_id: 'cust-123',
        proposal_approach: 'Trial product introduction with case study',
        confidence_score: 69.9,
        shouldIncludeInReasoningDisplay: false,
        reasoning_text: null,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: mock_explainRecommendationReasoning,
      evaluatePatternRelevance: mock_evaluatePatternRelevance,
    };

    const input_dealCondition = {
      customer_id: 'cust-123',
      industry: 'Manufacturing',
      company_size: 'Medium',
      deal_stage: 'Qualification',
      product_category: 'Software',
    };

    // Act: generateRecommendationを呼び出す
    const result = generateRecommendation(input_dealCondition, stub_AIRecommendationEngine);

    // Assert (1): shouldIncludeInReasoningDisplayがfalseであることを確認
    expect(result.shouldIncludeInReasoningDisplay).toBe(false);

    // Assert (2): explainRecommendationReasoningメソッドが呼び出されていないことを確認
    expect(mock_explainRecommendationReasoning).not.toHaveBeenCalled();

    // Assert (3): reasoning_textがnullであることを確認（UIに根拠説明テキストが表示されない）
    expect(result.reasoning_text).toBeNull();

    // Assert (4): 信頼度スコアが69.9%であることを確認
    expect(result.confidence_score).toBe(69.9);

    // Assert (5): 推奨内容自体は存在すること（根拠表示除外だが提案は生成される）
    expect(result.proposal_approach).toBe('Trial product introduction with case study');
  });
});