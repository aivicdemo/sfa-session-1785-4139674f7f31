import { visualizeRecommendationRationale } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-665
  test('推奨アプローチIDがnullのときにエラーが発生する', () => {
    expect(() => visualizeRecommendationRationale(null)).toThrow(/推奨アプローチID/);
  });
});