import { evaluateRecommendationConfidence } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能 - 過去成功パターン0件時の信頼度計算', () => {
  // SCEN-2419
  test('過去成功パターンが0件のとき、推奨精度スコアの信頼度が最低値(0.0)となること', () => {
    // Arrange: 過去成功パターン0件を模擬するモックデータ
    const emptyPatterns = [];

    // テスト用の新規案件データ
    const newDealData = {
      customerIndustry: '製造業',
      dealAmount: 5000000,
      stageCode: 'PROPOSAL',
      companySize: 'LARGE',
      decisionMaker: 'CXO',
    };

    // Act: 推奨精度スコア算出を実行
    // 過去パターンが0件の場合、信頼度スコアは最低値に設定される
    const confidenceScore = evaluateRecommendationConfidence(
      newDealData,
      emptyPatterns
    );

    // Assert: 信頼度が最低値(0.0)であることを確認
    // 計算式: confidence = matchedPatternCount / (matchedPatternCount + minThreshold)
    // matchedPatternCount = 0, minThreshold = 1 の場合
    // confidence = 0 / (0 + 1) = 0.0
    expect(confidenceScore.confidence).toBe(0.0);
    expect(confidenceScore.confidence).toBeGreaterThanOrEqual(0.0);
    expect(confidenceScore.confidence).toBeLessThanOrEqual(1.0);
    expect(confidenceScore.matchedPatternCount).toBe(0);
  });
});