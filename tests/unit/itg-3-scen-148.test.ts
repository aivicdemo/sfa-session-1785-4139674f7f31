import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-148: 推奨内容と根拠の紐付けが正確に表示される', () => {
    const recommendationContent = '顧客の予算制約に対応した段階的導入プラン';
    const patternId = 'pattern_001';
    const expectedReasoningText =
      '過去3年間で同規模顧客12件の成功事例に基づき、段階的導入により初期投資を30%削減しながら導入期間を短縮できた実績がある';

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationContent: recommendationContent,
        patternId: patternId,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        patternId: patternId,
        reasoningText: expectedReasoningText,
      }),
    };

    const newCaseData = {
      customerScale: '中堅企業',
      budget: 5000000,
      implementationPeriod: 3,
    };

    const result = explainRecommendationReasoning(
      newCaseData,
      mockAIRecommendationEngine
    );

    expect(result).resolves.toEqual({
      recommendationContent: recommendationContent,
      patternId: patternId,
      reasoningText: expectedReasoningText,
      isMatched: true,
    });

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newCaseData
    );
    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalledWith(patternId);
  });
});