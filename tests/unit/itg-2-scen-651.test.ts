import { visualizeRecommendationReason } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-651
  test('推奨根拠テーブルから推奨根拠データが0件のときに根拠なしデータが返される', () => {
    const recommendationId = 'REC-001';
    const emptyRecommendationReasons: any[] = [];

    const result = visualizeRecommendationReason(
      recommendationId,
      emptyRecommendationReasons
    );

    expect(result).toEqual({
      reason: 'なし',
      reasonCode: 'NO_REASON',
      displayText: '根拠情報なし'
    });
  });
});