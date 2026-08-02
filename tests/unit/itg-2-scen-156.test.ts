import { calculateMergeScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-156
  test('顧客名完全一致の名寄せ基準でスコア計算が正しく実行される', () => {
    const customerDataA = {
      id: 'cust_001',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const customerDataB = {
      id: 'cust_002',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const score = calculateMergeScore(customerDataA, customerDataB);

    expect(score).toBe(100);
  });
});