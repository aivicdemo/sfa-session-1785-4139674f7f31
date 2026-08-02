import { calculateDuplicateDetectionScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-203
  test('電話番号が異なるとき、重複判定スコアが低下する', () => {
    const customerA = {
      name: '山田太郎',
      address: '東京都渋谷区1-1-1',
      phoneNumber: '09012345678',
    };

    const customerB = {
      name: '山田太郎',
      address: '東京都渋谷区1-1-1',
      phoneNumber: '09087654321',
    };

    const duplicateScore = calculateDuplicateDetectionScore(customerA, customerB);

    expect(duplicateScore).toBeLessThanOrEqual(0.65);
    expect(duplicateScore).toBeGreaterThan(0);
  });
});