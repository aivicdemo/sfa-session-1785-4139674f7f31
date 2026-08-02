import { calculateDuplicateDetectionScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-197
  test('[normal] 顧客データ重複・不整合検出機能 - 顧客名が完全に異なるとき、重複判定スコアが最低値となる', () => {
    const customerA = {
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const customerB = {
      name: '鈴木花子',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const duplicateScore = calculateDuplicateDetectionScore(customerA, customerB);

    expect(duplicateScore).toBe(0);
  });
});