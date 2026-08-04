import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2910
  test('OpenAI API連携 - explainRecommendationReasoning呼び出しが正常応答を受けた場合、営業担当者向けの根拠説明文が生成される', async () => {
    const recommendationId = 'rec-001';
    const customerAttributes = {
      industry: '小売業',
      size: '中堅企業',
      region: '関東',
    };

    const stubReasoningResponse = {
      reasoning:
        '顧客の業界は小売業で、過去成功事例では同業種への提案時にPOS連携を強調したアプローチが成約率75%を達成しています。本件でも同様のアプローチを推奨します。',
      confidence: 0.87,
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(stubReasoningResponse),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = await explainRecommendationReasoning(
      recommendationId,
      customerAttributes,
      mockAIEngine
    );

    expect(result.displayText).toBe(
      '顧客の業界は小売業で、過去成功事例では同業種への提案時にPOS連携を強調したアプローチが成約率75%を達成しています。本件でも同様のアプローチを推奨します。'
    );
    expect(result.confidenceScore).toBe(0.87);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId,
      customerAttributes
    );
  });
});