import { decideSalesSupportPolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  // SCEN-500
  test('データ品質スコアが null のとき、エラーが発生する', () => {
    const salesRepresentative = {
      id: 'SR001',
      name: '営業太郎',
      department: '営業第一部',
    };

    const dataQualityScore = null;

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
    };

    expect(() => {
      decideSalesSupportPolicy(
        salesRepresentative,
        dataQualityScore,
        aiRecommendationEngineStub
      );
    }).toThrow(/データ品質スコア|Data quality score/);
  });
});