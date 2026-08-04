import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-2-1-1';

describe('推奨根拠表示機能 - 根拠情報信頼度スコア検証', () => {
  test('SCEN-1577: 根拠情報の信頼度スコアが負の値のとき、エラーが発生する', () => {
    const negativeConfidenceScore = -0.5;
    const mockRecommendationBasis = {
      confidenceScore: negativeConfidenceScore,
      pastCaseIds: ['CASE-001', 'CASE-002'],
      successPatternId: 'PATTERN-A1',
      timingRationale: 'Q2決算前の購買実績から',
      quantityRationale: '過去12ヶ月の平均購買量×1.2',
    };

    expect(() => {
      evaluatePatternRelevance(mockRecommendationBasis);
    }).toThrow(/信頼度スコア/);
  });
});