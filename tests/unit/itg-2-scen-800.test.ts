import { calculateDuplicateScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-800
  test('顧客名が異なる場合、重複度スコアが低値として計算される', () => {
    const customerDataA = {
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const customerDataB = {
      name: '田中次郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const duplicateScore = calculateDuplicateScore(customerDataA, customerDataB);

    expect(duplicateScore).toBeGreaterThanOrEqual(0.0);
    expect(duplicateScore).toBeLessThanOrEqual(0.4);
  });
});