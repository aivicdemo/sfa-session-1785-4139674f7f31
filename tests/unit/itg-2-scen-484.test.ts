import { calculateDuplicateDetectionRulePriority } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-484
  test('重複検知ルール実行優先度決定機能 - 検知効率が負の値のときにエラーが発生する', () => {
    const input = {
      dataQualityRiskScore: 0.8,
      detectionEfficiency: -0.5,
    };

    expect(() => calculateDuplicateDetectionRulePriority(input)).toThrow(/検知効率/);
  });
});