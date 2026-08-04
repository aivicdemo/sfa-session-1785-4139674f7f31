import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-579
  test('推奨根拠説明文生成機能 - 推奨根拠の信頼度が閾値0.7超のとき説明文に注釈が付されない', () => {
    const confidenceScore = 0.75;
    const reasoningText = '顧客の業界は製造業で、過去成功事例と一致します。提案内容はコスト削減に特化しており、類似案件での成約率は高い傾向です';

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(confidenceScore),
      explainRecommendationReasoning: jest.fn().mockReturnValue(reasoningText),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
    };

    const generatedExplanation = explainRecommendationReasoning(
      confidenceScore,
      reasoningText,
      mockAIRecommendationEngine
    );

    expect(generatedExplanation).toBe(
      '顧客の業界は製造業で、過去成功事例と一致します。提案内容はコスト削減に特化しており、類似案件での成約率は高い傾向です'
    );
    expect(generatedExplanation).not.toMatch(/※/);
    expect(generatedExplanation).not.toMatch(/信頼度は相対的に低めです/);
  });
});