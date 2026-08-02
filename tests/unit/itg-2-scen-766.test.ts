import { generateSignalDetectionBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-766
  test('信号検出根拠生成機能 - 最終接触日と反応パターンは揃うが購買周期が計算不可のとき、根拠に2要素のみが記載される', () => {
    const lastContactDate = '2024-01-15';
    const reactionPattern = '高頻度接触';
    const purchaseCycleCalculationFails = null;

    const result = generateSignalDetectionBasis({
      lastContactDate,
      reactionPattern,
      purchaseCycle: purchaseCycleCalculationFails,
    });

    expect(result.elements.length).toBe(2);
    expect(result.elements).toContainEqual({
      type: 'lastContactDate',
      value: '2024-01-15',
    });
    expect(result.elements).toContainEqual({
      type: 'reactionPattern',
      value: '高頻度接触',
    });
    expect(result.elements.some((e) => e.type === 'purchaseCycle')).toBe(false);
  });
});