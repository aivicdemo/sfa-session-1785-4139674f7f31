import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-686
  test('推奨根拠説明生成機能 - 説明文の生成で同じ推奨根拠で2回生成しても同じ説明文が返される', () => {
    const mockRecommendationEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const expectedExplanation =
      '顧客業種が「製造業」で規模が「中堅企業」、過去成功パターンとのマッチスコア0.92により、標準的な生産効率向上提案が適用可能と判定されました。同業他社での類似案件3件の成約実績に基づき、推奨タイミングは現在が最適です。';

    mockRecommendationEngine.explainRecommendationReasoning.mockReturnValue(
      expectedExplanation,
    );

    const recommendationReason = {
      recommendationId: 'REC-001',
      patternMatchScore: 0.92,
      customerIndustry: '製造業',
      customerSize: '中堅企業',
      successPatternCount: 3,
    };

    const firstExplanation = explainRecommendationReasoning(
      recommendationReason,
      mockRecommendationEngine,
    );

    const secondExplanation = explainRecommendationReasoning(
      recommendationReason,
      mockRecommendationEngine,
    );

    expect(firstExplanation).toBe(expectedExplanation);
    expect(secondExplanation).toBe(expectedExplanation);
    expect(firstExplanation).toBe(secondExplanation);
    expect(
      mockRecommendationEngine.explainRecommendationReasoning,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockRecommendationEngine.explainRecommendationReasoning,
    ).toHaveBeenCalledWith(recommendationReason);
  });
});