import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-669
  test('推奨内容根拠の可視化機能 - 入力された顧客IDがnullのとき、エラーが発生する', () => {
    expect(() => visualizeRecommendationReasoning(null as any)).toThrow(/顧客ID/);
  });
});